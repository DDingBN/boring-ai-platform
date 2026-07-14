# Database 模块设计

> 当前 `@repo/database` 没有数据库实现。本文除“当前实现”外是持久化层的目标设计。

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

## 2. 当前实现

`@repo/database` 当前没有 runtime dependency，`src/index.ts` 只导出两个类型：

```ts
export interface DatabaseConfig {
  url: string;
}

export interface DatabaseHealth {
  ok: boolean;
}
```

仓库目前没有：

- Prisma dependency、`schema.prisma` 或生成的 client。
- migration、seed 或 repository。
- 数据库连接、健康检查实现或测试。
- Conversation、Message、Run、Knowledge、Workflow 等持久化模型。

根 `.env` 中的 `DATABASE_URL` 当前是可选占位。Server 只校验其格式和协议，不会建立连接。
允许的协议为 `postgresql:`、`postgres:`、`mysql:` 和 `file:`；这一范围尚不代表已经选定 ORM、
数据库产品或向量存储。

## 3. 目标目录

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

## 4. 基础模型

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

## 5. 运行记录模型

`Run`、`RunStep` 和 `TraceEvent` 应比 RAG 和 workflow 更早落库。

原因：

- chat 已经需要记录模型、耗时、错误和原始响应。
- RAG 需要记录 retrieved chunks。
- workflow 需要记录每个节点的输入输出。
- agent 需要记录 tool call 和中间推理步骤。

统一模型能避免后续每个功能单独补日志表。

## 6. 向量存储选择

RAG 不是普通关系表就能完整解决的问题。进入知识库阶段前，需要明确本地向量检索方案。

可选方向：

| 方案                            | 适合场景                     |
| ------------------------------- | ---------------------------- |
| SQLite + sqlite-vec             | 本地优先、部署简单、适合学习 |
| Postgres + pgvector             | 更接近真实服务端应用         |
| LanceDB / Chroma / Qdrant local | 偏本地 AI 工具和向量库体验   |

建议早期优先考虑 SQLite + sqlite-vec 或 Postgres + pgvector。不要等到文档导入完成后才决定向量存储，否则 schema、repository 和检索 API 都会返工。

## 7. Repository 约束

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
