# Server 模块设计

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

## 2. 推荐目录

```txt
apps/server/src/
  config/
    env.ts
  middleware/
    error.middleware.ts
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

`index.ts` 只负责创建 app、注册 middleware/routes、启动服务。业务逻辑进入 `services/`。

## 3. API 设计

早期优先实现：

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

## 4. 校验和错误

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

## 5. 流式响应

Chat stream 使用 SSE 时，server 需要处理：

- `Content-Type: text/event-stream`
- heartbeat 或连接保活
- client abort
- provider stream error
- final completion event
- run step 写入

SSE 事件格式应复用 `packages/shared` 中的 `StreamEvent`，不要只为 chat 写临时协议。

## 6. 边界约束

- server 不直接拼 provider HTTP 请求，交给 `packages/ai`。
- server 不直接散落 Prisma 查询，交给 `packages/database` repositories。
- server 可以组合多个 package，但不承载底层实现。
- server 的服务函数应便于 API 测试和 mock。
