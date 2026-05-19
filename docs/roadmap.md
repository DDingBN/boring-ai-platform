# 开发路线图

## Phase 0：基础设施收口

目标：让仓库成为可靠的开发基础。

交付物：

- `.env.example`
- README 启动说明
- 真实 lint 命令
- `pnpm typecheck` 通过
- `pnpm build` 通过

状态：部分完成。

## Phase 1：最小 Chat + Run Inspector

目标：打通 frontend、server、shared、ai runtime，并开始记录运行过程。

链路：

```txt
web chat input
  -> server chat API
  -> ai provider
  -> run records
  -> web message list
  -> run inspector
```

交付物：

- chat request/response/shared schema
- API error 类型
- LLM provider interface
- OpenAI-compatible provider
- `POST /api/chat`
- chat 页面真实 API 调用
- Run Inspector 基础展示
- API key 缺失错误提示

## Phase 2：会话和运行记录持久化

目标：保存会话、消息和运行调试信息。

交付物：

- Prisma 初始化
- `DATABASE_URL`
- `Conversation`
- `Message`
- `Run`
- `RunStep`
- `TraceEvent`
- repositories
- `/api/runs`
- `/api/runs/:id`
- web 加载历史会话和运行详情

## Phase 3：流式响应

目标：让 chat 使用可复用的 SSE 事件协议。

交付物：

- `StreamEvent` schema
- `POST /api/chat/stream`
- provider streaming adapter
- 前端 SSE parser
- message delta 渲染
- run step 实时更新
- abort request

## Phase 4：知识库与 RAG

目标：支持基于文档的问答。

链路：

```txt
upload document
  -> extract text
  -> chunk text
  -> generate embeddings
  -> store chunks
  -> retrieve relevant chunks
  -> build prompt with citations
  -> answer
```

交付物：

- 向量存储方案决策
- `KnowledgeBase`
- `Document`
- `DocumentChunk`
- `Embedding`
- 文档上传 API
- chunker
- embedder
- retriever
- RAG pipeline
- 知识库页面
- 回答展示 citations 和 retrieved chunks

## Phase 5：Workflow Runtime

目标：把 `WorkflowGraph` 从类型变成可执行系统。

交付物：

- 类型化 workflow nodes
- graph validation
- workflow executor
- 基础节点：`start`、`prompt`、`llm`、`rag`、`tool`、`end`
- 每个节点写入 `RunStep`
- workflow run API
- executor 单元测试

## Phase 6：Workflow UI

目标：用可视化方式创建、保存、运行 workflow。

交付物：

- workflow 列表页
- workflow 编辑页
- React Flow 图编辑器
- 节点配置面板
- workflow 保存和加载
- 从 UI 运行 workflow
- 运行状态和日志展示

## Phase 7：Tools 与 Agents

目标：支持多步骤 AI 行为。

交付物：

- tool registry
- tool input schema
- 内置 tools
- tool call 日志
- agent loop
- max steps
- timeout
- abort signal
- tool allowlist
- 前端展示 tool calls

## Phase 8：质量、样例和文档

目标：让项目更容易维护、演示和继续扩展。

交付物：

- `packages/ai` 单元测试
- `apps/server` API 测试
- RAG pipeline 测试
- workflow executor 测试
- seed/demo data
- README 完整开发说明
- 常见错误排查

测试不要等到 Phase 8 才开始。Phase 8 的目标是补齐覆盖和演示资料，核心逻辑在对应阶段就应该有基础测试。

## 暂缓项

- 多用户团队协作。
- 复杂 RBAC。
- 大屏 dashboard。
- 与核心运行链路无关的营销页面。
- 复杂条件分支、循环 workflow、人工审批节点。
