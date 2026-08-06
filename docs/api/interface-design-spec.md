# 接口设计规范

> 本文定义目标 API 契约，不是已上线接口清单。当前实现有 `GET /health`、回声版
> `POST /api/chat` 和 HTTP 基础 middleware；其余业务接口、分页、幂等性和 SSE 尚未实现。

## 0. 当前接口基线

Server 已挂载 `/api/chat`，但尚无 runtime schema；已经注册 JSON body、request ID 和统一错误
middleware。

当前已注册接口：

```http
GET /health
POST /api/chat
```

当前响应：

```json
{
  "ok": true
}
```

这个接口只表示进程能够响应 HTTP，不检查数据库或 provider，也不采用本文定义的
`ApiSuccess<T>` 包装。响应会通过 `x-request-id` 返回请求标识。

`POST /api/chat` 当前只读取最后一条 user message 并返回固定回声。它没有请求 schema、service、
AI provider 或持久化，不符合本文目标 Chat 契约。具体进度见
[当前实现状态](../current-status.md)。

## 1. 目标

本文档定义 Boring AI Platform 的 HTTP API、流式事件、DTO、错误、分页、校验和版本演进规范。

接口设计目标：

- 前端、Server、AI runtime 和 Database 边界清晰。
- 所有 AI 调用都能关联运行记录。
- 普通响应和流式响应使用同一套业务语义。
- API 契约由文档明确，Server 使用 runtime schema 强制校验，并由接口测试验证。

## 2. 设计顺序

设计新接口时，优先先明确用户动作、请求、响应和错误，再按实际需要补充资源、持久化与运行记录。
下面是检查清单，不要求为一个简单接口预先完成所有抽象：

1. 定义用户动作。
2. 定义资源模型。
3. 定义运行记录关系。
4. 定义请求 DTO。
5. 定义响应 DTO。
6. 定义错误码。
7. 定义权限和敏感字段。
8. 定义持久化行为。
9. 定义测试用例。
10. 实现 HTTP route。

## 3. 核心资源

第一阶段目标核心资源：

| 资源           | 含义                        |
| -------------- | --------------------------- |
| `Conversation` | 一组连续 chat 消息          |
| `Message`      | 会话中的单条消息            |
| `Run`          | 一次 AI 任务执行            |
| `RunStep`      | 一次 Run 内的执行步骤       |
| `TraceEvent`   | Run 或 RunStep 的细粒度事件 |
| `ModelConfig`  | 模型 provider、model、参数  |

后续资源：

| 资源              | 阶段           |
| ----------------- | -------------- |
| `KnowledgeBase`   | RAG            |
| `Document`        | RAG            |
| `DocumentChunk`   | RAG            |
| `Embedding`       | RAG            |
| `Workflow`        | Workflow       |
| `WorkflowVersion` | Workflow       |
| `ToolCall`        | Tools / Agents |

## 4. API 分层

### 4.1 HTTP API

目标对外 API 位于 `apps/server/src/routes`。该目录当前尚未创建。

职责：

- 解析 HTTP 请求。
- 调用 request schema 校验。
- 调用 service。
- 返回 response DTO 或 SSE event。

不允许：

- 直接调用模型 provider。
- 直接写 Prisma 查询。
- 直接拼接 RAG prompt。
- 暴露内部异常堆栈。

### 4.2 Service

目标业务编排位于 `apps/server/src/services`。该目录当前尚未创建。

职责：

- 编排 `packages/ai` 和 `packages/database`。
- 创建和更新 Run。
- 处理业务错误。
- 处理事务边界。

### 4.3 前后端契约边界

Web 和 Server 不共享业务 TypeScript 类型。HTTP request、response、error 和 SSE event 的字段以
本文档为约定：

- Server 在对应业务模块中维护 request runtime schema 和 response shaping。
- Web 在自己的 API/Page 模块中维护实际需要的本地类型，也可以在简单场景依赖类型推断。
- Server 业务模型、数据库实体和 Provider SDK 类型不跨边界暴露。
- 接口变更同时更新文档和接口测试；当调用方明显增多时，再考虑从 OpenAPI 自动生成客户端。

## 5. URL 规范

目标基础前缀：

```txt
/api
```

资源使用复数名词：

```txt
/api/conversations
/api/messages
/api/runs
/api/workflows
```

具体资源使用 path param：

```txt
/api/conversations/:conversationId
/api/runs/:runId
```

动作接口只用于真实动作：

```txt
POST /api/chat
POST /api/chat/stream
POST /api/workflows/:workflowId/run
```

禁止：

```txt
GET /api/getMessages
POST /api/createConversation
POST /api/runWorkflowById
```

## 6. HTTP 方法规范

| 方法     | 用途                   |
| -------- | ---------------------- |
| `GET`    | 查询资源，不产生副作用 |
| `POST`   | 创建资源或触发动作     |
| `PATCH`  | 局部更新资源           |
| `DELETE` | 删除资源               |

规则：

- `GET` 不接收 body。
- 创建资源优先使用 `POST /resources`。
- 更新资源优先使用 `PATCH /resources/:id`。
- 动作接口使用 `POST`。
- 删除需要软删除时，响应仍使用 `DELETE`，内部实现可标记 `deletedAt`。

## 7. 响应格式

### 7.1 成功响应

单资源响应：

```ts
interface ApiSuccess<T> {
  data: T;
}
```

列表响应：

```ts
interface ApiListResponse<T> {
  data: T[];
  page: PageInfo;
}
```

创建成功：

```txt
201 Created
```

普通成功：

```txt
200 OK
```

无内容成功：

```txt
204 No Content
```

### 7.2 错误响应

错误响应统一格式：

```ts
interface ApiErrorResponse {
  error: ApiError;
}

interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: unknown;
  requestId?: string;
}
```

错误码：

```ts
type ApiErrorCode =
  | 'INVALID_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'MISSING_API_KEY'
  | 'MODEL_PROVIDER_ERROR'
  | 'RUN_NOT_FOUND'
  | 'CONVERSATION_NOT_FOUND'
  | 'WORKFLOW_VALIDATION_ERROR'
  | 'INTERNAL_ERROR';
```

HTTP 状态码映射：

| 状态码 | 错误码                 |
| ------ | ---------------------- |
| `400`  | `INVALID_REQUEST`      |
| `401`  | `UNAUTHORIZED`         |
| `403`  | `FORBIDDEN`            |
| `404`  | `NOT_FOUND`            |
| `409`  | `CONFLICT`             |
| `429`  | `RATE_LIMITED`         |
| `500`  | `INTERNAL_ERROR`       |
| `502`  | `MODEL_PROVIDER_ERROR` |

禁止返回：

```ts
{ success: false, msg: 'failed' }
```

## 8. DTO 规范

### 8.1 命名

请求：

```txt
ChatRequest
CreateConversationRequest
RunWorkflowRequest
```

响应：

```txt
ChatResponse
ConversationResponse
RunDetailResponse
```

输入对象：

```txt
ChatInputMessage
WorkflowInput
ToolInput
```

持久化实体：

```txt
Conversation
Message
Run
RunStep
```

### 8.2 字段规则

- 使用 `camelCase`。
- 时间字段使用 ISO 8601 字符串。
- ID 字段使用字符串。
- 前端创建资源时不传 `id`。
- 前端创建资源时不传 `createdAt`、`updatedAt`。
- 敏感字段永远不返回给前端。
- 可选字段使用 `?`，不使用 `null` 表示缺省。
- 需要明确清空时才允许 `null`。

### 8.3 请求 DTO 不等于实体

错误示例：

```ts
interface ChatRequest {
  messages: ChatMessage[];
}
```

正确示例：

```ts
interface ChatRequest {
  conversationId?: string;
  message: string;
  model?: string;
  temperature?: number;
}
```

## 9. Runtime Schema

每个 request DTO 必须有对应 schema。

示例：

```ts
export const chatRequestSchema = z.object({
  conversationId: z.string().optional(),
  message: z.string().trim().min(1).max(20000),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
```

Schema 放在 `apps/server` 的对应业务模块中。Server 必须使用它校验不可信的 `body`、`params`
和 `query`。Web 不导入这个 schema；前端按接口文档发送请求，是否为响应增加本地类型或运行时
校验由页面复杂度和风险决定。

## 10. 分页、排序、过滤

列表接口统一 query：

```ts
interface PageQuery {
  cursor?: string;
  limit?: number;
}

interface PageInfo {
  nextCursor?: string;
  hasMore: boolean;
}
```

默认值：

```txt
limit = 20
max limit = 100
```

示例：

```txt
GET /api/runs?limit=20
GET /api/runs?cursor=xxx&limit=20
```

列表默认按 `createdAt desc` 排序。

需要其他排序时显式定义，不提供自由拼接字段：

```txt
GET /api/runs?status=failed
GET /api/runs?type=chat
```

## 11. Request ID

每个请求都应有 `requestId`。

来源：

1. 优先读取请求头 `x-request-id`。
2. 没有则 server 生成。

响应头返回：

```txt
x-request-id: <requestId>
```

错误响应带上：

```ts
{
  error: {
    code: 'INVALID_REQUEST',
    message: 'Invalid request body.',
    requestId: 'req_xxx'
  }
}
```

## 12. 幂等性

会触发模型调用、扣费或创建运行记录的接口，支持幂等键。

请求头：

```txt
idempotency-key: <client-generated-key>
```

适用接口：

```txt
POST /api/chat
POST /api/workflows/:workflowId/run
POST /api/documents
```

规则：

- 同一用户、同一 endpoint、同一 idempotency key 命中同一次结果。
- 请求 body 不一致时返回 `409 CONFLICT`。
- 幂等记录可设置过期时间。

## 13. AI Run 规范

所有 AI 动作接口必须创建或关联 `Run`。

适用动作：

- chat
- RAG question answering
- workflow run
- tool call
- agent run

最小 Run：

```ts
interface Run {
  id: string;
  type: RunType;
  status: RunStatus;
  input?: unknown;
  output?: unknown;
  error?: ApiError;
  model?: ModelConfig;
  startedAt: string;
  completedAt?: string;
  latencyMs?: number;
}

type RunType = 'chat' | 'rag' | 'workflow' | 'agent' | 'tool';
type RunStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
```

接口规则：

- `POST /api/chat` 成功时返回 `runId`。
- `POST /api/chat/stream` 首个事件必须包含 `runId`。
- 失败的模型调用也要记录 failed Run。
- provider 原始错误不能直接返回给前端，必须映射成 `ApiError`。

## 14. Stream API 规范

流式接口使用 SSE。

请求：

```txt
POST /api/chat/stream
Accept: text/event-stream
Content-Type: application/json
```

响应头：

```txt
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

事件格式：

```txt
event: message.delta
data: {"type":"message.delta","runId":"run_123","content":"hello"}
```

通用事件：

```ts
type StreamEvent =
  | { type: 'run.started'; runId: string; run: Run }
  | { type: 'run.completed'; runId: string; run: Run }
  | { type: 'run.failed'; runId: string; error: ApiError }
  | { type: 'run.step.started'; runId: string; stepId: string; name: string }
  | { type: 'run.step.completed'; runId: string; stepId: string; output?: unknown }
  | { type: 'message.delta'; runId: string; content: string }
  | { type: 'message.completed'; runId: string; message: Message }
  | { type: 'retrieval.completed'; runId: string; chunks: RetrievedChunk[] }
  | { type: 'tool.call.started'; runId: string; toolCallId: string; name: string }
  | { type: 'tool.call.completed'; runId: string; toolCallId: string; output: unknown }
  | { type: 'error'; runId?: string; error: ApiError };
```

规则：

- 第一个业务事件必须是 `run.started`。
- 正常结束必须发送 `run.completed`。
- 失败必须发送 `error` 或 `run.failed`。
- 前端主动取消时 server 标记 Run 为 `cancelled`。
- SSE data 必须是 JSON。
- 不在 SSE 中发送未脱敏的 provider raw payload。

## 15. Chat API

### 15.1 非流式 Chat

```txt
POST /api/chat
```

请求：

```ts
interface ChatRequest {
  conversationId?: string;
  message: string;
  model?: string;
  temperature?: number;
}
```

响应：

```ts
interface ChatResponse {
  conversationId: string;
  message: Message;
  runId: string;
}
```

行为：

- `conversationId` 缺省时创建新会话。
- server 持久化 user message。
- server 创建 Run。
- server 调用 LLM provider。
- server 持久化 assistant message。
- server 完成 Run。
- 返回 assistant message 和 runId。

错误：

| 条件                | 状态码 | 错误码                   |
| ------------------- | ------ | ------------------------ |
| 请求为空            | `400`  | `INVALID_REQUEST`        |
| API key 缺失        | `400`  | `MISSING_API_KEY`        |
| conversation 不存在 | `404`  | `CONVERSATION_NOT_FOUND` |
| provider 失败       | `502`  | `MODEL_PROVIDER_ERROR`   |

### 15.2 流式 Chat

```txt
POST /api/chat/stream
```

请求：

```ts
Chat stream 使用与非流式接口相同的 JSON 请求字段，由不同 URL 明确响应模式，不再额外传
`stream: true`。
```

事件顺序：

```txt
run.started
run.step.started
message.delta*
message.completed
run.step.completed
run.completed
```

失败事件顺序：

```txt
run.started
run.step.started?
error
run.failed
```

## 16. Conversation API

### 16.1 创建会话

```txt
POST /api/conversations
```

请求：

```ts
interface CreateConversationRequest {
  title?: string;
}
```

响应：

```ts
interface ConversationResponse {
  conversation: Conversation;
}
```

### 16.2 会话列表

```txt
GET /api/conversations?cursor=&limit=
```

响应：

```ts
interface ConversationListResponse {
  data: Conversation[];
  page: PageInfo;
}
```

### 16.3 会话消息

```txt
GET /api/conversations/:conversationId/messages?cursor=&limit=
```

响应：

```ts
interface MessageListResponse {
  data: Message[];
  page: PageInfo;
}
```

## 17. Run API

### 17.1 运行记录列表

```txt
GET /api/runs?type=&status=&cursor=&limit=
```

响应：

```ts
interface RunListResponse {
  data: RunSummary[];
  page: PageInfo;
}
```

### 17.2 运行记录详情

```txt
GET /api/runs/:runId
```

响应：

```ts
interface RunDetailResponse {
  run: Run;
  steps: RunStep[];
  events: TraceEvent[];
}
```

用途：

- Chat Run Inspector。
- RAG 检索调试。
- Workflow 节点执行日志。
- Agent tool call 调试。

## 18. Knowledge API

RAG 阶段再实现，先保留契约方向。

```txt
GET  /api/knowledge-bases
POST /api/knowledge-bases
GET  /api/knowledge-bases/:knowledgeBaseId
POST /api/documents
GET  /api/documents/:documentId
GET  /api/documents/:documentId/chunks
```

文档上传接口行为：

- 创建 Document。
- 提取文本。
- chunk。
- embedding。
- 写入向量存储。
- 记录 ingestion Run。

上传响应：

```ts
interface UploadDocumentResponse {
  document: Document;
  runId: string;
}
```

## 19. Workflow API

Workflow runtime 稳定后再实现 UI 细节。

```txt
GET   /api/workflows
POST  /api/workflows
GET   /api/workflows/:workflowId
PATCH /api/workflows/:workflowId
POST  /api/workflows/:workflowId/run
```

运行 workflow：

```ts
interface RunWorkflowRequest {
  input: Record<string, unknown>;
  versionId?: string;
}

interface RunWorkflowResponse {
  runId: string;
}
```

规则：

- workflow graph 必须先通过 validation。
- 每个节点执行产生 `RunStep`。
- workflow output 写入 Run。
- 节点错误映射为 `WORKFLOW_VALIDATION_ERROR` 或 `INTERNAL_ERROR`。

## 20. 版本规范

早期不在 URL 中加入版本号。

首版目标：

```txt
/api/chat
```

当出现破坏性变更时，再引入：

```txt
/api/v2/chat
```

兼容规则：

- 新增 response 字段属于兼容变更。
- 新增 optional request 字段属于兼容变更。
- 删除字段属于破坏性变更。
- 修改字段含义属于破坏性变更。
- 修改错误码属于破坏性变更。

## 21. 安全规范

禁止返回：

- API key
- authorization header
- provider secret
- database URL
- 本地绝对敏感路径
- 未脱敏的环境变量

日志脱敏：

```txt
sk-xxxxxx -> sk-***redacted***
Bearer xxx -> Bearer ***redacted***
```

请求体限制：

- chat content 单条最大 20000 字符。
- messages 数量第一阶段最大 50。
- 上传文件大小单独按文档类型配置。

## 22. 测试规范

每个接口至少覆盖：

- 成功请求。
- schema 校验失败。
- 资源不存在。
- provider/database 失败。
- 错误响应格式。
- requestId 返回。

Chat 必测：

- 新会话 chat。
- 已有会话 chat。
- API key 缺失。
- provider 失败。
- 返回 runId。

Stream 必测：

- 首事件为 `run.started`。
- delta 事件顺序正确。
- completed 事件存在。
- provider error 映射为 `error`。
- client abort 后 Run 为 `cancelled`。

## 23. 新接口设计模板

设计新接口时复制以下模板：

```md
## 接口名称

### 用户动作

### 资源

### Run 关系

### HTTP

`METHOD /api/path`

### Request

### Response

### Stream Events

### 持久化行为

### 错误码

### 安全要求

### 测试用例
```

## 24. 第一阶段接口清单

必须先完成：

```txt
GET  /health
POST /api/chat
POST /api/chat/stream
GET  /api/conversations
POST /api/conversations
GET  /api/conversations/:conversationId/messages
GET  /api/runs
GET  /api/runs/:runId
```

不在第一阶段做：

```txt
POST /api/agents
POST /api/tools
POST /api/workflows/:workflowId/run
POST /api/documents
```

这些接口等对应 runtime 设计稳定后再实现。
