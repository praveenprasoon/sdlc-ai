import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import axios, { AxiosInstance } from "axios";
import dotenv from "dotenv";

dotenv.config();

// 1. Strict Configuration & Validation
const SWAGGER_URL = process.env.SWAGGER_URL;
const API_BASE_URL = process.env.API_BASE_URL;
const API_TOKEN = process.env.API_TOKEN;

if (!SWAGGER_URL || !API_BASE_URL || !API_TOKEN) {
  console.error("❌ Critical Error: Missing required environment variables (SWAGGER_URL, API_BASE_URL, API_TOKEN).");
  process.exit(1);
}

// 2. Initialize Resilient Axios Instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15-second production timeout protection
  headers: {
    "Authorization": `Bearer ${API_TOKEN}`,
    "Content-Type": "application/json",
    "User-Agent": "Production-MCP-OpenAPI-Engine/1.0"
  }
});

// 3. Instantiate MCP Server Core
const server = new Server(
  { name: "production-openapi-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Global state cache for parsed tools
let compiledTools: any[] = [];
let openApiSpec: any = null;

/**
 * Bootstraps and dynamically converts Swagger paths into structured MCP schemas
 */
async function initializeSwaggerSchema() {
  try {
    const response = await axios.get(SWAGGER_URL);
    openApiSpec = response.data;
    const paths = openApiSpec.paths || {};

    for (const [path, methods] of Object.entries(paths)) {
      for (const [method, operation] of Object.entries(methods as any)) {
        const op = operation as any;
        // Production Guardrail: Ensure an operationId exists to uniquely name the tool
        const toolName = op.operationId || `${method}_${path.replace(/[{}]/g, "").replace(/\//g, "_")}`;
        
        compiledTools.push({
          name: toolName,
          description: op.summary || op.description || `Execute HTTP ${method.toUpperCase()} on ${path}`,
          inputSchema: buildJsonSchema(op.parameters, op.requestBody),
          _meta: { path, method, originalSpec: op } // Internal routing metadata
        });
      }
    }
    console.error(`🚀 Successfully mapped ${compiledTools.length} Swagger endpoints into MCP tools.`);
  } catch (error: any) {
    console.error("❌ Failed to parse Swagger schema payload:", error.message);
    process.exit(1);
  }
}

/**
 * Helper to build an LLM-readable input validation schema from Swagger params
 */
function buildJsonSchema(parameters: any[] = [], requestBody: any = {}) {
  const properties: any = {};
  const required: string[] = [];

  // Parse Path and Query Parameters
  parameters.forEach((param) => {
    properties[param.name] = {
      type: param.schema?.type || "string",
      description: param.description || ""
    };
    if (param.required) required.push(param.name);
  });

  // Parse JSON Request Body Schemas
  const bodySchema = requestBody?.content?.["application/json"]?.schema;
  if (bodySchema && bodySchema.properties) {
    Object.entries(bodySchema.properties).forEach(([key, val]: [string, any]) => {
      properties[key] = {
        type: val.type || "string",
        description: val.description || ""
      };
      if (bodySchema.required?.includes(key)) required.push(key);
    });
  }

  return { type: "object", properties, required };
}

// 4. MCP Request Handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: compiledTools.map(({ _meta, ...publicTool }) => publicTool) };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const targetTool = compiledTools.find(t => t.name === name);

  if (!targetTool) {
    return { isError: true, content: [{ type: "text", text: `Error: Tool '${name}' not found.` }] };
  }

  const { path, method } = targetTool._meta;
  let targetUrl = path;
  const queryParams: any = {};
  const bodyData: any = {};

  // Production Execution Router: Map incoming LLM schema arguments into the correct location
  if (args) {
    Object.entries(args).forEach(([key, value]) => {
      if (path.includes(`{${key}}`)) {
        targetUrl = targetUrl.replace(`{${key}}`, encodeURIComponent(String(value)));
      } else if (targetTool._meta.originalSpec.parameters?.some((p: any) => p.name === key && p.in === "query")) {
        queryParams[key] = value;
      } else {
        bodyData[key] = value;
      }
    });
  }

  try {
    // Execute target API endpoint safely
    const apiResponse = await apiClient({
      method: method,
      url: targetUrl,
      params: queryParams,
      data: method !== "get" ? bodyData : undefined
    });

    return {
      content: [{ type: "text", text: JSON.stringify(apiResponse.data, null, 2) }]
    };
  } catch (error: any) {
    // Production Observability & Error Tracing
    return {
      isError: true,
      content: [{ 
        type: "text", 
        text: `API Execution Failed [${error.response?.status || "Network Error"}]: ${JSON.stringify(error.response?.data || error.message)}` 
      }]
    };
  }
});

// 5. Dynamic Engine Initialization
await initializeSwaggerSchema();
const transport = new StdioServerTransport();
await server.connect(transport);
