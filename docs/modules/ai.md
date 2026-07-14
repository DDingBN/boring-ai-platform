# AI Runtime 模块设计

> 当前 `@repo/ai` 只有请求相关类型，没有可执行 AI runtime。本文除“当前实现”外均为后续设计。

## 1. 模块职责

`packages/ai` 是项目的核心学习模块，负责所有 AI runtime 逻辑。

它不处理 HTTP，也不直接关心前端 UI。它应该提供可测试、可替换、可组合的能力：

- LLM generation
- streaming generation
- embeddings
- chunking
- retrieval
- RAG pipeline
- tool registry
- agent loop
- workflow executor

## 2. 当前实现

`@repo/ai` 当前仅依赖 `@repo/shared`，没有安装任何模型 provider SDK，也没有调用 shared 中的类型。
`src/index.ts` 只导出：

```ts
export interface AiModelConfig {
  provider: string;
  model: string;
}

export interface AiTextMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
}

export interface AiTextGenerationRequest {
  model: AiModelConfig;
  messages: AiTextMessage[];
}
```

当前没有：

- `generateText` 或 `streamText` 函数。
- DeepSeek/OpenAI-compatible provider 实现。
- API key 使用和 provider 错误映射。
- embedding、chunking、retrieval、RAG。
- tool registry、agent loop、workflow validation 或 executor。
- 单元测试。

Server 配置中的 `AI_PROVIDER=deepseek` 和 `DEEPSEEK_API_KEY` 尚未接入本 package。

## 3. 目标目录

```txt
packages/ai/src/
  llm/
    client.ts
    types.ts
    providers/
      openai-compatible.ts
  embeddings/
    embedder.ts
    types.ts
  rag/
    chunker.ts
    retriever.ts
    pipeline.ts
  tools/
    registry.ts
    builtin.ts
  agents/
    agent.ts
    executor.ts
  workflows/
    nodes.ts
    executor.ts
    validate.ts
  index.ts
```

## 4. Provider 抽象

业务层不应该直接依赖某个模型供应商。建议先定义通用 interface：

```ts
export interface LlmProvider {
  generateText(request: GenerateTextRequest): Promise<GenerateTextResult>;
  streamText(request: GenerateTextRequest): AsyncIterable<GenerateTextStreamEvent>;
}
```

结合当前唯一允许的 `AI_PROVIDER=deepseek`，第一版可以实现 DeepSeek 使用的 OpenAI-compatible
adapter，同时保留 provider interface。这样后续接本地模型、其他云模型或 mock provider 都不会影响 server 和 web。

## 5. RAG Pipeline

RAG 不应只是一段 prompt 拼接函数。建议拆成：

```txt
question
  -> rewrite or normalize query
  -> embed query
  -> retrieve chunks
  -> build prompt with citations
  -> generate answer
  -> return answer + sources + trace
```

每一步都应该能产出 trace event，方便前端查看检索片段、prompt 和最终回答。

## 6. Workflow Executor

workflow runtime 接入前，需要先明确执行语义：

- 第一阶段只支持线性或 DAG。
- 暂缓循环、人工审批、复杂条件分支。
- 运行前必须校验 graph。
- 每个节点执行都产生 `RunStep`。
- 每个节点记录 input、output、error、startedAt、completedAt。

支持的基础节点：

- `start`
- `prompt`
- `llm`
- `rag`
- `tool`
- `end`

## 7. Tools 和 Agents

tool registry 建议先做最小能力：

- tool name
- description
- input schema
- handler
- timeout
- safe error

agent loop 必须有边界：

- max steps
- max tool calls
- timeout
- abort signal
- tool allowlist

不要在没有运行记录和 tool call 日志前先做复杂 agent UI。

## 8. 测试策略

`packages/ai` 应尽早有单元测试，因为这里最适合脱离 web/server 测试。

优先测试：

- provider mock
- chunker
- retriever
- RAG prompt builder
- workflow graph validation
- workflow executor
- agent max steps 和 timeout
