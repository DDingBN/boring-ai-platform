# 项目进度

本文档记录 Boring AI Platform 的当前实现状态、后续任务优先级和短期范围。功能发生变化时，
应同步更新本页以及相关 API 文档。架构与设计原则见 [README](../README.md)。

跨设备或切换 Codex 会话时，先阅读 [协作说明](../AGENTS.md) 和 [开发交接](handoff.md)；每次完成一段开发后
更新交接页并随代码一起提交。

## 已实现

### Web

- Vue 3、Vite、Vue Router 和 Ant Design Vue 基础工程。
- 响应式主布局、菜单、面包屑以及基础错误页面。
- Axios 请求封装和统一 API 响应解包。
- Chat 页面可以发送消息、显示 Python Server 返回的助手消息并续传会话 ID。
- Chat 页面具有发送中、重复提交阻止和基础错误提示状态。

### Server

- Python 3.13、FastAPI、Pydantic 2 和 uv 基础工程。
- 健康检查、请求 ID、统一响应格式、请求校验和统一错误处理。
- Mock Provider 默认无需密钥即可运行。
- DeepSeek Provider 通过 `langchain-deepseek` 调用真实模型。
- Chat 请求参数校验、会话 ID 生成和助手响应。
- Model 与 Conversation 规划接口返回明确的 `501 Not Implemented` 响应。
- FastAPI 自动生成 OpenAPI 与 Swagger 文档。

当前 Chat 只把本次 `content` 传给 Provider。`conversationId` 仅生成或原样返回，前端续传
该 ID 不代表服务端保存了会话，也不会为模型提供历史上下文。当前业务接口没有 SSE、请求取消、
Agent 工具循环或 LangGraph 运行时。

## 数据库状态

- 暂无数据库运行时依赖、migration、业务表或持久化逻辑。
- 已移除旧 Prisma 骨架，后续计划使用 SQLAlchemy 2、Alembic 和 PostgreSQL。
- [数据库设计](database.md) 是 Model、Conversation、Message、Run 及状态流转的设计方案，尚未落地。
- RunStep、工具消息结构和等待审批状态尚需补充设计，不能视为已完成的数据模型。

## 自动化测试

Server 最小测试当前覆盖：

- Health 响应和请求 ID。
- Mock Chat 响应。
- Chat 请求校验。
- 不存在接口的统一 `404` 响应。

Web 暂无组件或 E2E 测试。测试补充项列在下方对应阶段。

## 后续任务

以下任务均未实现。优先完成 P0，再推进 P1，P2 在对应前置能力具备后开展。

### P0：流式聊天与取消

- [ ] 增加 SSE 事件协议和流式聊天接口。
- [ ] 前端使用流式 `fetch` 渲染增量消息。
- [ ] 使用 AbortController 取消请求。
- [ ] 补充 Provider 超时、断开和错误状态测试。

### P1：数据库持久化

- [ ] 引入 SQLAlchemy 2、Alembic、asyncpg，接入 PostgreSQL。
- [ ] 实现 Model、Conversation、Message、Run；补充 RunStep 设计并实现。
- [ ] 实现 Repository 和事务边界。
- [ ] 实现会话历史、cursor pagination、归属校验和幂等键。

### P1：Agent 工具调用

- [ ] 定义 Tool Registry 和工具输入/输出 Schema，补充工具消息结构设计。
- [ ] 使用 LangChain `create_agent` 实现最小工具循环。
- [ ] 加入工具超时、结果长度限制、最大调用次数和错误处理。
- [ ] 实现查询订单、搜索知识和创建工单三个示例工具，后续接入真实业务工具。

### P2：LangGraph 与人工审批

- [ ] 将 Conversation 映射为 LangGraph `thread_id`。
- [ ] 配置 PostgreSQL Checkpointer，保存可恢复的执行快照。
- [ ] 补充等待审批状态设计，对有副作用的工具加入 interrupt/resume。
- [ ] 前端实现 approve、edit、reject 审批交互。

### P2：RAG 与 MCP

- [ ] 建立文档解析、切分、Embedding、检索和引用链路。
- [ ] 增加检索评测与租户数据过滤。
- [ ] 接入一个只读 MCP Server，明确工具授权边界。

### P2：工程化与面试准备

- [ ] 接入 Ruff、Pyright 和统一格式检查。
- [ ] 完善 pytest 单元、集成和 Provider Contract Test，补充请求体大小和规划接口测试。
- [ ] 增加 Web 组件测试与一条端到端测试。
- [ ] 生成 OpenAPI TypeScript Client，逐步将 Web 迁移到 TypeScript。
- [ ] 增加结构化日志、Trace、token/延迟统计和 Agent Eval 数据集，可选接入 LangSmith。
- [ ] 增加 Docker Compose、部署说明、架构图和演示脚本。

## 短期非目标

短期内不实现复杂多 Agent、模型微调、自建推理服务、工作流画布和大规模分布式执行。
优先完成一个可持久化、可取消、可审批、可评测的单 Agent 垂直链路。
