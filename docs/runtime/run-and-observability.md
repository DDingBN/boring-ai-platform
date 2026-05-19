# 运行记录与可观测性

## 1. 为什么提前设计

这个项目的核心不是“得到一次模型回答”，而是理解 AI 应用如何执行。

因此运行记录不应该等到项目后期再补。最小 chat 闭环就应该产生运行数据，后续 RAG、workflow、tools、agents 都复用这套机制。

## 2. 核心概念

### Run

一次完整 AI 任务。

示例：

- 一次 chat 请求
- 一次 RAG 问答
- 一次 workflow 执行
- 一次 agent loop

建议字段：

- `id`
- `type`
- `status`
- `input`
- `output`
- `error`
- `model`
- `startedAt`
- `completedAt`
- `latencyMs`

### RunStep

Run 内的一步执行。

示例：

- build prompt
- call llm
- retrieve chunks
- call tool
- execute workflow node

建议字段：

- `id`
- `runId`
- `name`
- `type`
- `status`
- `input`
- `output`
- `error`
- `startedAt`
- `completedAt`
- `latencyMs`

### TraceEvent

执行过程中的细粒度事件。

示例：

- stream delta
- retrieved chunk
- provider raw response
- tool call started
- tool call completed
- warning
- error

建议字段：

- `id`
- `runId`
- `stepId?`
- `type`
- `payload`
- `createdAt`

## 3. 状态模型

建议统一状态：

```ts
export type RunStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
```

Run 和 RunStep 都使用同一套状态，便于前端展示和过滤。

## 4. 事件类型

早期建议支持：

- `run.started`
- `run.completed`
- `run.failed`
- `run.step.started`
- `run.step.completed`
- `message.delta`
- `message.completed`
- `retrieval.completed`
- `tool.call.started`
- `tool.call.completed`
- `error`

事件命名保持稳定，前端 Run Inspector 根据事件类型渲染不同内容。

## 5. 前端展示

Run Inspector 建议展示：

- 状态
- 总耗时
- 模型和参数
- messages
- prompt
- retrieved chunks
- tool calls
- raw provider response
- errors

早期可以从 `/api/chat` 返回 `runId`，再通过 `/api/runs/:id` 获取详情。流式阶段则直接把 trace event 推给前端。

## 6. 设计约束

- 不把日志只写到 console。
- 不为 chat、RAG、workflow 分别设计独立日志模型。
- 不在前端拼装调试数据，后端应该返回结构化运行信息。
- 对敏感数据做脱敏策略，尤其是 API key、authorization header 和本地文件路径。
