# Boring AI Platform

Boring AI Platform 是一个正在开发的 AI 应用练习项目。当前仓库提供 React Web、Express
Server 和基础工程化；真实模型调用、消息持久化和流式输出尚未实现。

## 技术栈

- Web：React 19、Vite 8、React Router 7、Ant Design 6
- Server：Node.js 22、Express 5、Zod 4、TypeScript
- Workspace：pnpm + Turborepo

## 环境要求

- Node.js `22.12.0`
- pnpm `10.25.0`

## 安装

```bash
pnpm install
```

可选地复制环境变量示例：

```bash
cp .env.example .env
```

没有 `.env` 时也会使用默认值启动。

| 变量               | 默认值        | 当前用途                       |
| ------------------ | ------------- | ------------------------------ |
| `NODE_ENV`         | `development` | Server 运行环境                |
| `SERVER_HOST`      | `127.0.0.1`   | Server 监听地址                |
| `SERVER_PORT`      | `3001`        | Server 监听端口                |
| `WEB_HOST`         | `127.0.0.1`   | Vite 监听地址                  |
| `WEB_PORT`         | `5173`        | Vite 开发端口                  |
| `AI_PROVIDER`      | `deepseek`    | 仅做 Server 配置校验，尚未调用 |
| `DEEPSEEK_API_KEY` | 空            | 尚未用于模型请求               |
| `DATABASE_URL`     | 空            | 尚未建立数据库连接             |

`DEEPSEEK_API_KEY` 只能由 Server 读取，不要添加 `VITE_` 前缀或提交真实密钥。

## 启动

同时启动 Web 和 Server：

```bash
pnpm dev
```

默认地址：

- Web：`http://127.0.0.1:5173`
- Server：`http://127.0.0.1:3001`

也可以分别启动：

```bash
pnpm --filter @repo/web dev
pnpm --filter @repo/server dev
```

Vite 已将 `/api` 代理到默认 Server 地址。当前 `/chat` 页面仍使用浏览器本地 Mock
回复，没有调用 Server。

## 当前可用接口

- `GET /health`：进程存活检查
- `POST /api/chat`：回声占位接口，不调用真实模型

请求和响应示例见 [API 文档](./docs/api.md)。

## 仓库结构

```text
apps/
  web/       React 前端
  server/    Express API
docs/
  api.md     当前已实现接口
```

Web 和 Server 保持前后端边界，只通过 HTTP JSON 协作，不共享业务 TypeScript 类型。

## 检查命令

```bash
pnpm format:check
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

当前自动化测试覆盖 Server 的 health、request ID、非法 JSON 和请求体大小限制，尚未覆盖
Chat 业务行为。

## 当前限制

- Chat 页面与 Server 未连通。
- 没有真实 LLM provider。
- 没有数据库、会话或运行记录。
- 没有流式输出和请求取消。
