# Shared 契约设计

> 本文的代码示例是目标契约。当前实际导出见下文“当前实现”，两者尚未完全一致。

## 1. 模块职责

`packages/shared` 只放前后端共享契约和轻量工具，不放业务实现。

它应该回答三个问题：

- 前端可以发什么请求？
- 后端会返回什么响应？
- 流式事件和错误长什么样？

## 2. 当前实现

`@repo/shared` 目前通过 `src/index.ts` 导出四组纯 TypeScript 类型：

| 模块        | 当前导出                                                 |
| ----------- | -------------------------------------------------------- |
| `common`    | `BaseEntity`                                             |
| `chat`      | `ChatRole`、`ChatMessage`、`ChatRequest`、`ChatResponse` |
| `workflow`  | Workflow 节点、边、位置、数据和图类型                    |
| `knowledge` | `KnowledgeType`                                          |

当前 Chat 契约为：

```ts
export type ChatRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
}

export interface ChatResponse {
  message: ChatMessage;
}
```

它目前主要供 Web Mock Chat 使用，尚未形成可用的 HTTP 契约。package 没有 runtime schema 依赖，
也没有 `ApiError`、`StreamEvent`、Conversation 或 Run 类型。

当前 Workflow 契约已声明 `start`、`prompt`、`llm`、`tool`、`rag`、`end` 六种节点类型，
但节点配置仍是 `Record<string, unknown>`，只适合作为图结构占位。

## 3. 目标契约分层

建议明确区分：

- Input DTO：前端请求输入，不包含服务端生成字段。
- Response DTO：API 返回给前端的数据。
- Entity：持久化实体，包含 `id`、`createdAt`、`updatedAt`。
- StreamEvent：SSE 或后续实时通道使用的事件。
- ApiError：统一错误结构。

不要让前端在创建消息时传 `id`、`createdAt` 这类服务端字段。

## 4. 目标 Chat 契约

下一阶段应从当前 `ChatMessage` 扩展为更明确的类型：

```ts
export type ChatRole = 'system' | 'user' | 'assistant' | 'tool';

export interface ChatInputMessage {
  role: Exclude<ChatRole, 'tool'>;
  content: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export interface ChatRequest {
  conversationId?: string;
  messages: ChatInputMessage[];
  model?: string;
  temperature?: number;
  stream?: boolean;
}

export interface ChatResponse {
  conversationId: string;
  message: ChatMessage;
  runId: string;
}
```

## 5. 目标 Stream Event 契约

建议定义可复用事件，而不是只服务 chat：

```ts
export type StreamEvent =
  | { type: 'message.delta'; runId: string; content: string }
  | { type: 'message.completed'; runId: string; message: ChatMessage }
  | { type: 'run.step.started'; runId: string; stepId: string; name: string }
  | { type: 'run.step.completed'; runId: string; stepId: string; output?: unknown }
  | { type: 'retrieval.completed'; runId: string; chunks: RetrievedChunk[] }
  | { type: 'tool.call.started'; runId: string; toolCallId: string; name: string }
  | { type: 'tool.call.completed'; runId: string; toolCallId: string; output: unknown }
  | { type: 'error'; runId?: string; error: ApiError };
```

这套事件后续可被 chat、RAG、workflow 和 agent 共用。

## 6. Workflow 契约

当前 `WorkflowNodeData.config: Record<string, unknown>` 适合占位，但执行器接入前应改成 discriminated union。

建议方向：

```ts
export type WorkflowNode = StartNode | PromptNode | LlmNode | RagNode | ToolNode | EndNode;
```

每种节点拥有自己的 `data.config`，例如：

- `PromptNodeConfig`
- `LlmNodeConfig`
- `RagNodeConfig`
- `ToolNodeConfig`

这样 UI 配置面板、运行前校验、executor 都能复用同一套类型。

## 7. Runtime Schema

TypeScript 类型不能保护运行时 API。建议使用 schema 工具，例如 `zod`，让 shared 同时导出：

- TypeScript type
- request schema
- response schema
- stream event schema

server 使用 schema 校验请求，web 使用 schema 解析响应和 stream event。
