# Server 模块设计

> 当前 Server 已有启动配置、HTTP 基础中间件和健康检查；本文中的 routes/services、Chat、Run
> 与 SSE 仍为目标设计。

## 1. 模块职责

`apps/server` 是 HTTP API 和服务编排层。它负责把前端请求转换为稳定的业务调用，但不直接实现底层 LLM、Embedding、RAG、Prisma 或 workflow executor 细节。

核心职责：

- HTTP routes
- request validation
- response shaping
- service orchestration
- streaming response
- unified error handling
- config and environment loading
- future auth entry point

## 2. 当前实现

技术栈为 Express 5、TypeScript、tsx 和 tsup，package 使用 ESM。当前入口执行以下操作：

1. 从仓库根目录加载 `.env`（存在时）。
2. 校验 Server 配置。
3. 通过 `createApp()` 创建 Express 应用并注册基础中间件。
4. 注册 `GET /health`。
5. 在入口监听配置的 host 和 port。

当前健康检查响应：

```json
{
  "ok": true
}
```

每个响应都带有 `x-request-id`。JSON 请求体上限为 `1mb`；错误由末尾中间件转换为包含
`code`、`message` 和 `requestId` 的 JSON，服务端堆栈不会返回给客户端。

当前限制：

- 没有 `/api` 前缀和已挂载的业务 Router。
- `src/chat/index.ts` 的 `POST /` Router 返回固定文本，但没有在入口注册，外部不可访问。
- 没有 service、runtime validation、CORS 或 SSE。
- `@repo/ai` 和 `@repo/database` 已声明为依赖，但入口尚未调用它们。

配置项如下：

| 变量               | 默认值        | 校验                                       |
| ------------------ | ------------- | ------------------------------------------ |
| `NODE_ENV`         | `development` | 仅允许 `development`、`test`、`production` |
| `SERVER_HOST`      | `127.0.0.1`   | 不允许空白字符                             |
| `SERVER_PORT`      | `3001`        | 1–65535 的整数                             |
| `AI_PROVIDER`      | `deepseek`    | 当前只允许 `deepseek`                      |
| `DEEPSEEK_API_KEY` | 空            | 可选；非空时不允许空白字符                 |
| `DATABASE_URL`     | 空            | 可选；非空时校验 URL 和数据库协议          |

这里对 provider、API key 和数据库 URL 的处理只是配置校验，不代表对应能力已经接入。

## 3. 目标目录

```txt
apps/server/src/
  app.ts
  config/
    env.ts
  middleware/
    error.middleware.ts
    request-id.middleware.ts
  routes/
    chat.routes.ts
    conversation.routes.ts
    knowledge.routes.ts
    runs.routes.ts
    workflow.routes.ts
  services/
    chat.service.ts
    knowledge.service.ts
    workflow.service.ts
  index.ts
```

`app.ts` 和上述两个 middleware 已实现；`routes` 和 `services` 目录仍是后续结构。`index.ts` 只负责
加载配置和启动服务，后续业务逻辑进入 `services/`。

## 4. API 设计

当前只实现 `GET /health`。下一阶段优先实现：

```txt
GET  /health
POST /api/chat
GET  /api/runs
GET  /api/runs/:id
```

随后补充：

```txt
GET  /api/conversations
POST /api/conversations
GET  /api/conversations/:id/messages

POST /api/knowledge-bases
POST /api/documents

POST /api/workflows
GET  /api/workflows/:id
POST /api/workflows/:id/run
```

如果需要流式响应，建议使用：

```txt
POST /api/chat/stream
```

也可以在 `POST /api/chat` 内根据 `stream: true` 切换 SSE，但需要保持响应类型清晰。

## 5. 校验和错误

所有外部请求都应经过 runtime validation。建议把 schema 放在 `packages/shared`，server 直接复用。

统一错误格式：

```ts
interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}
```

常见错误码：

- `INVALID_REQUEST`
- `MISSING_API_KEY`
- `MODEL_PROVIDER_ERROR`
- `RUN_NOT_FOUND`
- `INTERNAL_ERROR`

API key 缺失、provider 失败、请求取消都要返回可理解的错误，避免前端只能显示未知失败。

## 6. 流式响应

Chat stream 使用 SSE 时，server 需要处理：

- `Content-Type: text/event-stream`
- heartbeat 或连接保活
- client abort
- provider stream error
- final completion event
- run step 写入

SSE 事件格式应复用 `packages/shared` 中的 `StreamEvent`，不要只为 chat 写临时协议。

## 7. 边界约束

- server 不直接拼 provider HTTP 请求，交给 `packages/ai`。
- server 不直接散落 Prisma 查询，交给 `packages/database` repositories。
- server 可以组合多个 package，但不承载底层实现。
- server 的服务函数应便于 API 测试和 mock。
