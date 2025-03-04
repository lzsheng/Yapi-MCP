# Yapi MCP Server

```bash
pnpm install
pnpm run dev
```

## 环境配置

在项目根目录创建 `.env` 文件，并配置以下环境变量：

```env
# YApi配置
YAPI_TOKEN=your_yapi_token_here    # YApi平台的访问令牌
YAPI_BASE_URL=your_yapi_base_url_here    # YApi平台的基础URL地址

# 服务器配置
PORT=3334    # MCP服务器监听端口
```

## Available Tools

The server provides the following MCP tools:

### get_api_desc

获取指定的yapi接口.

Parameters:

- `apiId` (string): Yapi的接口ID


#### 基础框架，参考
https://github.com/GLips/Figma-Context-MCP