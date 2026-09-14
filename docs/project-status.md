# 项目进度

本文档记录 Boring AI Platform 的当前实现状态。功能发生变化时，应同步更新本页以及相关
API 文档。

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

## 数据库状态

- 暂无数据库运行时依赖、migration、业务表或持久化逻辑。
- 已移除旧 Prisma 骨架，后续计划使用 SQLAlchemy 2、Alembic 和 PostgreSQL。
- 数据库实体和状态流转仍以 `docs/database.md` 为设计依据。

## 自动化测试

Server 最小测试当前覆盖：

- Health 响应和请求 ID。
- Mock Chat 响应。
- Chat 请求校验。
- 不存在接口的统一 `404` 响应。

更完整的请求体大小、Provider 异常和规划接口测试将在工程化阶段补充。Web 暂无自动化测试。

## 待实现

- 使用 SSE 实现流式输出和请求取消。
- 使用 SQLAlchemy/Alembic 实现 Model、Conversation、Message、Run 和 RunStep。
- 使用 LangChain `create_agent` 实现工具调用循环。
- 使用 LangGraph 实现 checkpoint、interrupt/resume 和人工审批。
- 实现 RAG、MCP 与真实业务工具。
- 接入结构化 Trace、LangSmith（可选）和 Agent Eval。
- 为 Python 接入 Ruff、Pyright 和完整测试，为 Web 补充组件/E2E 测试。
- 生成 OpenAPI TypeScript Client，逐步将 Web 迁移到 TypeScript。
- 补充 Docker 与部署流程。
