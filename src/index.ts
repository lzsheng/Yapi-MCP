import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { YapiMcpServer } from "./server";
import { getServerConfig } from "./config";

export async function startServer(): Promise<void> {
  const config = getServerConfig();

  const server = new YapiMcpServer(config.yapiBaseUrl, config.yapiToken);

  // Check if we're running in stdio mode (e.g., via CLI)
  const isStdioMode = process.env.NODE_ENV === "cli" || process.argv.includes("--stdio");

  if (isStdioMode) {
    console.log("Initializing Yapi MCP Server in stdio mode...");
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } else {
    console.log(`Initializing Yapi MCP Server in HTTP mode on port ${config.port}...`);
    await server.startHttpServer(config.port);
  }

  console.log("\n可用工具:");
  console.log("- get_api_desc: 获取YApi接口信息");
}

// If this file is being run directly, start the server
if (require.main === module) {
  startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
}
