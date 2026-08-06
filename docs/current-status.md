# 当前实现状态

本文记录仓库当前已经落地的能力，用来区分“可运行实现”和其他文档中的“目标设计”。

> 文档基线：2026-08-06，当前仓库版本 `0.1.0`。

## 1. 当前结论

项目目前处于基础设施完成、最小 Chat 闭环尚未打通的阶段。

已经具备：

- pnpm workspace + Turborepo monorepo。
- Web 和 Server 的开发、构建、Lint、类型检查命令。
- 统一的根目录 `.env` 加载和启动配置校验。
- Web 应用布局、菜单、路由、首页、Mock Chat、登录页和错误页。
- Server 的可测试 `createApp()`、HTTP 基础中间件和 `GET /health` 健康检查。
- AI、Database 两个 package 的最小类型占位。
- 已挂载的 `POST /api/chat` 回声 Router 和 Vite `/api` 开发代理。

尚未具备：

- Web Chat 到 Server 的 API Client 和真实调用。
- Chat request runtime schema 和业务 service。
- 真实 LLM provider 调用或流式响应。
- 会话、消息、运行记录持久化。
- Prisma schema、数据库 client、migration 或 repository。
- RAG、Tools、Agents、Workflow executor 和 Run Inspector。

## 2. 可运行入口

### Web

默认地址：`http://127.0.0.1:5173`

| 路由                   | 当前行为                                   |
| ---------------------- | ------------------------------------------ |
| `/`                    | 重定向到 `/home`                           |
| `/home`                | 展示静态占位首页和 Mock 指标               |
| `/chat`                | 浏览器本地状态驱动的 Mock 对话，不请求后端 |
| `/login`               | 仅展示登录表单，没有认证提交逻辑           |
| `/403`、`/404`、`/500` | 错误占位页                                 |
| 其他路径               | 展示 404 页面                              |

菜单和动态路由由 `apps/web/src/data/menuData.ts` 与
`apps/web/src/data/routeRegistry.tsx` 共同维护。当前菜单只有“首页”和“我的问答”。

### Server

默认地址：`http://127.0.0.1:3001`

当前已注册接口：

```http
GET /health
POST /api/chat
```

响应示例：

```json
{
  "ok": true
}
```

Server 对 JSON 请求体设置了 `1mb` 上限。每个响应都会返回 `x-request-id`，错误响应使用统一
JSON 结构且不包含服务端堆栈。

`POST /api/chat` 当前读取最后一条 user message 并返回固定回声消息。它已挂载，但没有 runtime
schema、AI provider、持久化或对应接口测试，不能视为真实 Chat 闭环。

## 3. 环境变量

Web 和 Server 都从仓库根目录读取 `.env`。没有 `.env` 时也可以使用默认值启动。

| 变量               | 默认值        | 当前用途                                                      |
| ------------------ | ------------- | ------------------------------------------------------------- |
| `NODE_ENV`         | `development` | Server 校验运行环境；允许 `development`、`test`、`production` |
| `SERVER_HOST`      | `127.0.0.1`   | Server 监听地址                                               |
| `SERVER_PORT`      | `3001`        | Server 监听端口，必须为 1–65535 的整数                        |
| `WEB_HOST`         | `127.0.0.1`   | Vite 开发和预览监听地址                                       |
| `WEB_PORT`         | `5173`        | Vite 开发端口，必须为 1–65535 的整数                          |
| `AI_PROVIDER`      | `deepseek`    | Server 配置占位；当前只接受 `deepseek`，尚未调用 provider     |
| `DEEPSEEK_API_KEY` | 空            | Server 可读取并校验，尚未用于模型请求                         |
| `DATABASE_URL`     | 空            | 可选配置占位；尚未建立数据库连接                              |

`DATABASE_URL` 设置后只接受 `postgresql:`、`postgres:`、`mysql:` 或 `file:` 协议。
密钥只允许由 Server 读取，不应增加 `VITE_` 前缀。

## 4. Package 现状

| Package          | 当前导出                                                    | 当前限制                              |
| ---------------- | ----------------------------------------------------------- | ------------------------------------- |
| `@repo/ai`       | `AiModelConfig`、`AiTextMessage`、`AiTextGenerationRequest` | 没有 provider、生成函数或外部 AI SDK  |
| `@repo/database` | `DatabaseConfig`、`DatabaseHealth`                          | 没有 ORM、client、schema 或持久化实现 |

仓库不设置跨端 Shared package。Web 展示类型、Server HTTP 类型、AI Provider 类型和后续数据库实体
分别由所属模块维护；接口字段通过 API 文档约定，Server 在 HTTP 边界进行 runtime validation。

## 5. 开发命令

在仓库根目录执行：

```bash
pnpm dev
pnpm lint
pnpm test
pnpm typecheck
pnpm build
pnpm format:check
```

`pnpm dev` 会同时启动 Web 与 Server，属于持续运行命令。各 workspace 也可以单独运行：

```bash
pnpm --filter @repo/web dev
pnpm --filter @repo/server dev
```

当前自动化测试覆盖 Server 的健康检查、request ID、JSON 解析错误和请求体上限。

## 6. 下一步

当前应继续完成 [开发路线图](./roadmap.md) 的 Phase 1：先确定 Chat HTTP 文档并在 Server 实现
runtime schema，再接入 AI provider、记录 Run，最后让 Web Chat 使用真实接口并展示运行信息。
