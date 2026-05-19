# Database 模块设计

## 1. 模块职责

`packages/database` 统一管理持久化逻辑。

它负责：

- database client
- schema
- migrations
- repositories
- seed/demo data
- persistence-oriented mapping

server 不直接散落数据库查询，应该通过 repositories 访问持久化数据。

## 2. 推荐目录

```txt
packages/database/
  prisma/
    schema.prisma
    migrations/
  src/
    client.ts
    repositories/
      conversation.repository.ts
      message.repository.ts
      run.repository.ts
      knowledge.repository.ts
      document.repository.ts
      workflow.repository.ts
    index.ts
```

## 3. 基础模型

早期优先：

- `Conversation`
- `Message`
- `Run`
- `RunStep`
- `TraceEvent`
- `ModelConfig`

RAG 阶段补充：

- `KnowledgeBase`
- `Document`
- `DocumentChunk`
- `Embedding`

Workflow 阶段补充：

- `Workflow`
- `WorkflowVersion`
- `WorkflowRun`

Tool 和 agent 阶段补充：

- `ToolCall`
- `AgentRun`

## 4. 运行记录模型

`Run`、`RunStep` 和 `TraceEvent` 应比 RAG 和 workflow 更早落库。

原因：

- chat 已经需要记录模型、耗时、错误和原始响应。
- RAG 需要记录 retrieved chunks。
- workflow 需要记录每个节点的输入输出。
- agent 需要记录 tool call 和中间推理步骤。

统一模型能避免后续每个功能单独补日志表。

## 5. 向量存储选择

RAG 不是普通关系表就能完整解决的问题。进入知识库阶段前，需要明确本地向量检索方案。

可选方向：

| 方案 | 适合场景 |
| --- | --- |
| SQLite + sqlite-vec | 本地优先、部署简单、适合学习 |
| Postgres + pgvector | 更接近真实服务端应用 |
| LanceDB / Chroma / Qdrant local | 偏本地 AI 工具和向量库体验 |

建议早期优先考虑 SQLite + sqlite-vec 或 Postgres + pgvector。不要等到文档导入完成后才决定向量存储，否则 schema、repository 和检索 API 都会返工。

## 6. Repository 约束

repositories 应提供业务友好的函数，而不是泄露 ORM 细节。

示例：

- `createConversation`
- `appendMessage`
- `createRun`
- `appendRunStep`
- `appendTraceEvent`
- `findRunById`
- `createDocumentChunks`
- `searchRelevantChunks`

返回值应映射为 shared 中定义的 response DTO 或 server 内部 service model。
