# Python 迁移记录与后续任务

## 1. 迁移目标

将原 Express/TypeScript Server 迁移为 Python/FastAPI Server，同时保留 Vue Web、HTTP API
路径、统一响应格式和 pnpm/Turborepo 的顶层使用体验。第一阶段优先建立可运行的纵向链路，
数据库、流式输出、Agent 工具和完整工程规范分阶段实现。

## 2. 本次迁移范围

- [x] 安装 uv，并由 uv 管理 Python 3.13。
- [x] 在 `apps/server` 创建 `pyproject.toml` 和 Python 虚拟环境配置。
- [x] 使用 FastAPI 复刻 Health、Chat 和规划占位接口。
- [x] 保留 `{ code, msg, data }`、`x-request-id` 和现有 API 路径。
- [x] 使用 Pydantic 校验 Chat 请求，并将校验错误规范化为 HTTP 400。
- [x] 增加无需密钥的 Mock Provider。
- [x] 使用 `langchain-deepseek` 增加 DeepSeek Provider。
- [x] Web 渲染助手回复、保存会话 ID，并增加发送中和错误状态。
- [x] 保留 `pnpm dev` 作为 Web 与 Server 的统一开发入口。
- [x] 增加最小 Python API 测试。
- [x] Vue 与 Python 开发服务器联调验收。
- [x] 移除已完成替代的 TypeScript/Prisma Server 文件。
- [x] 清理旧 TypeScript Server 配置、依赖和本地缓存，并重新生成 pnpm 锁文件。

## 3. 关键决策

### 3.1 不保留 Node 网关

当前项目没有独立扩缩容、协议转换或团队边界需求，采用 `Vue -> FastAPI`。避免引入
`Vue -> Node -> Python` 带来的双重接口、部署和排障成本。

### 3.2 Mock 为默认 Provider

`AI_PROVIDER=mock` 时项目无需模型密钥即可启动和验证。配置 `AI_PROVIDER=deepseek`、
`DEEPSEEK_API_KEY` 和 `DEEPSEEK_MODEL` 后切换到真实模型。

### 3.3 暂不引入 LangGraph

第一阶段通过 LangChain Chat Model 完成单次模型调用。实现工具调用时使用 LangChain
`create_agent`；需要持久化执行状态、人工审批和暂停恢复时再引入 LangGraph。

### 3.4 业务数据与执行快照分离

后续业务数据使用 SQLAlchemy/Alembic 保存 Conversation、Message、Run 和 RunStep；
LangGraph Checkpointer 只保存可恢复的执行快照，不替代业务数据库。

## 4. 当前启动方式

```bash
pnpm install
uv sync --project apps/server
pnpm dev
```

- Web：`http://127.0.0.1:5173`
- Server：`http://127.0.0.1:3001`
- OpenAPI：`http://127.0.0.1:3001/docs`

首次安装 uv 后需要重新打开终端，使系统 PATH 生效。

## 5. 迁移验收记录

验收日期：2026-09-14。

- uv：`0.12.13`。
- Python：`3.13.15`，由 uv 管理。
- Python 依赖：已生成并提交 `uv.lock`。
- Server：pytest `4 passed`。
- Web：ESLint 通过，Vite 生产构建通过。
- Workspace：根目录 `pnpm test` 和 `pnpm build` 通过。
- 联调：通过 Vite `/api` 代理完成两次 Chat 请求，并确认 `conversationId` 保持不变。
- DeepSeek：Provider 使用测试密钥完成本地初始化验证，未发起外部模型请求。

已知非阻塞提示：

- Starlette TestClient 当前输出一条来自依赖内部的 AnyIO deprecation warning。
- Vite 提示主 JavaScript chunk 超过 500 kB；后续通过路由懒加载和拆包处理。
- 仓库 `core.autocrlf=true`，Git 在 Windows 上会提示 LF/CRLF 转换。

## 6. 后续任务

### P0：完成基础聊天闭环

- [ ] 增加 SSE 事件协议和流式聊天接口。
- [ ] 前端使用流式 `fetch` 渲染增量消息。
- [ ] 使用 AbortController 取消请求。
- [ ] 补充 Provider 超时、断开和错误状态测试。

### P1：数据库持久化

- [ ] 引入 SQLAlchemy 2、Alembic、asyncpg。
- [ ] 实现 Model、Conversation、Message、Run、RunStep。
- [ ] 实现 Repository 和事务边界。
- [ ] 实现会话历史、cursor pagination、归属校验和幂等键。

### P1：Agent 工具调用

- [ ] 定义 Tool Registry 和工具输入/输出 Schema。
- [ ] 使用 LangChain `create_agent` 实现最小工具循环。
- [ ] 加入工具超时、结果长度限制、最大调用次数和错误处理。
- [ ] 实现查询订单、搜索知识和创建工单三个示例工具。

### P2：LangGraph 与人工审批

- [ ] 将 Conversation 映射为 LangGraph `thread_id`。
- [ ] 配置 PostgreSQL Checkpointer。
- [ ] 对有副作用的工具加入 interrupt/resume。
- [ ] 前端实现 approve、edit、reject 审批交互。

### P2：RAG 与 MCP

- [ ] 建立文档解析、切分、Embedding、检索和引用链路。
- [ ] 增加检索评测与租户数据过滤。
- [ ] 接入一个只读 MCP Server，明确工具授权边界。

### P2：工程化与面试准备

- [ ] 接入 Ruff、Pyright 和统一格式检查。
- [ ] 完善 pytest 单元、集成和 Provider Contract Test。
- [ ] 增加 Web 组件测试与一条端到端测试。
- [ ] 生成 OpenAPI TypeScript Client。
- [ ] 增加结构化日志、Trace、token/延迟统计和 Eval 数据集。
- [ ] 增加 Docker Compose、部署说明、架构图和演示脚本。

## 7. 非目标

短期内不实现复杂多 Agent、模型微调、自建推理服务、工作流画布和大规模分布式执行。
优先完成一个可持久化、可取消、可审批、可评测的单 Agent 垂直链路。
