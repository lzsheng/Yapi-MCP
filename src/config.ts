import { config } from "dotenv";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { Logger } from "./services/yapi/logger";

// Load environment variables from .env file
config();

interface ServerConfig {
  yapiBaseUrl: string;
  yapiToken: string;
  port: number;
  yapiCacheTTL: number; // 缓存时效，单位为分钟
  yapiLogLevel: string; // 日志级别：debug, info, warn, error
  configSources: {
    yapiBaseUrl: "cli" | "env" | "default";
    yapiToken: "cli" | "env" | "default";
    port: "cli" | "env" | "default";
    yapiCacheTTL: "cli" | "env" | "default";
    yapiLogLevel: "cli" | "env" | "default";
  };
}

function maskApiKey(key: string): string {
  if (key.length <= 4) return "****";
  return `****${key.slice(-4)}`;
}

interface CliArgs {
  "yapi-base-url"?: string;
  "yapi-token"?: string;
  port?: number;
  "yapi-cache-ttl"?: number;
  "yapi-log-level"?: string;
}

export function getServerConfig(): ServerConfig {
  // Parse command line arguments
  const argv = yargs(hideBin(process.argv))
    .options({
      "yapi-base-url": {
        type: "string",
        description: "YApi服务器基础URL",
      },
      "yapi-token": {
        type: "string",
        description: "YApi服务器授权Token",
      },
      port: {
        type: "number",
        description: "Port to run the server on",
      },
      "yapi-cache-ttl": {
        type: "number",
        description: "YApi缓存有效期（分钟），默认10分钟",
      },
      "yapi-log-level": {
        type: "string",
        description: "YApi日志级别 (debug, info, warn, error)",
        choices: ["debug", "info", "warn", "error"],
      },
    })
    .help()
    .parseSync() as CliArgs;

  const config: ServerConfig = {
    yapiBaseUrl: "http://localhost:3000",
    yapiToken: "",
    port: 3388,
    yapiCacheTTL: 10, // 默认缓存10分钟
    yapiLogLevel: "info", // 默认日志级别
    configSources: {
      yapiBaseUrl: "default",
      yapiToken: "default",
      port: "default",
      yapiCacheTTL: "default",
      yapiLogLevel: "default",
    },
  };


  // Handle YAPI_BASE_URL
  if (argv["yapi-base-url"]) {
    config.yapiBaseUrl = argv["yapi-base-url"];
    config.configSources.yapiBaseUrl = "cli";
  } else if (process.env.YAPI_BASE_URL) {
    config.yapiBaseUrl = process.env.YAPI_BASE_URL;
    config.configSources.yapiBaseUrl = "env";
  }

  // Handle YAPI_TOKEN
  if (argv["yapi-token"]) {
    config.yapiToken = argv["yapi-token"];
    config.configSources.yapiToken = "cli";
  } else if (process.env.YAPI_TOKEN) {
    config.yapiToken = process.env.YAPI_TOKEN;
    config.configSources.yapiToken = "env";
  }

  // Handle PORT
  if (argv.port) {
    config.port = argv.port;
    config.configSources.port = "cli";
  } else if (process.env.PORT) {
    config.port = parseInt(process.env.PORT, 10);
    config.configSources.port = "env";
  }

  // Handle YAPI_CACHE_TTL
  if (argv["yapi-cache-ttl"]) {
    config.yapiCacheTTL = argv["yapi-cache-ttl"];
    config.configSources.yapiCacheTTL = "cli";
  } else if (process.env.YAPI_CACHE_TTL) {
    const cacheTTL = parseInt(process.env.YAPI_CACHE_TTL, 10);
    if (!isNaN(cacheTTL)) {
      config.yapiCacheTTL = cacheTTL;
      config.configSources.yapiCacheTTL = "env";
    }
  }

  // Handle YAPI_LOG_LEVEL
  if (argv["yapi-log-level"]) {
    config.yapiLogLevel = argv["yapi-log-level"];
    config.configSources.yapiLogLevel = "cli";
  } else if (process.env.YAPI_LOG_LEVEL) {
    const validLevels = ["debug", "info", "warn", "error"];
    const logLevel = process.env.YAPI_LOG_LEVEL.toLowerCase();
    if (validLevels.includes(logLevel)) {
      config.yapiLogLevel = logLevel;
      config.configSources.yapiLogLevel = "env";
    }
  }

  // 创建日志实例
  const logger = new Logger("Config", config.yapiLogLevel);

  // Log configuration sources
  logger.info("\nConfiguration:");
  logger.info(
    `- YAPI_BASE_URL: ${config.yapiBaseUrl} (source: ${config.configSources.yapiBaseUrl})`,
  );
  logger.info(
    `- YAPI_TOKEN: ${config.yapiToken ? maskApiKey(config.yapiToken) : "未配置"} (source: ${config.configSources.yapiToken})`,
  );
  logger.info(`- PORT: ${config.port} (source: ${config.configSources.port})`);
  logger.info(`- YAPI_CACHE_TTL: ${config.yapiCacheTTL} 分钟 (source: ${config.configSources.yapiCacheTTL})`);
  logger.info(`- YAPI_LOG_LEVEL: ${config.yapiLogLevel} (source: ${config.configSources.yapiLogLevel})`);
  logger.info(""); // Empty line for better readability

  return config;
}
