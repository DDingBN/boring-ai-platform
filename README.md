# Boring AI Platform

Boring AI Platform 是一个用于练习 AI 应用开发的全栈项目，采用 monorepo 管理 Vue Web、
FastAPI Server 和配套工程配置。

服务端已从 Express/TypeScript 迁移至 Python/FastAPI，保留原有 HTTP API 路径、响应格式和
顶层开发命令。当前已跑通最小聊天闭环，完整能力与后续计划见
[项目进度](./docs/project-status.md)。

## 技术栈

- Web：Vue 3、Vite 8、Vue Router 4、Ant Design Vue 4、JavaScript
- Server：Python 3.13、FastAPI、Pydantic 2、LangChain
- Workspace：pnpm + Turborepo
- Python 工具链：uv

## 架构与设计原则

### Vue 直接调用 FastAPI

采用 `Vue → FastAPI`，当前没有需要独立网关承担的扩缩容、协议转换或团队边界需求。
保持单一服务端可以减少接口、部署和排障成本。路由负责 HTTP 边界，`services` 承担业务逻辑，
`llm` 适配模型；前后端通过 `/api/v1`、`{ code, msg, data }` 和 `x-request-id` 约定协作。

### 默认使用 Mock Provider

Mock 使开发和自动化测试无需密钥即可运行，也便于复现错误。测试通过依赖覆盖注入 Service，
避免真实模型请求；需要体验真实模型时再按下方配置切换到 DeepSeek。

### 按执行需求引入 Agent 与 LangGraph

当前 LangChain 仅用于单次 Chat Model 调用。后续计划使用 `create_agent` 实现工具循环，
需要持久化执行状态、人工审批和暂停恢复时，再显式接入 LangGraph 的状态与恢复能力。
这些能力目前尚未实现。

### 业务数据与执行快照分工

计划使用 SQLAlchemy/Alembic 保存 Conversation、Message、Run 及后续设计的 RunStep。
LangGraph Checkpointer 只负责可恢复的执行快照，不替代业务数据库。目前没有数据库运行时；
表结构、事务与归属规则见 [数据库设计](./docs/database.md)，待补设计列在项目进度中。

## 环境要求

- Node.js `22.12.0`
- pnpm `10.25.0`
- Python `3.13`
- uv `0.12` 或兼容版本

## 安装

```bash
pnpm install --frozen-lockfile
uv sync --project apps/server
```

首次安装 uv 后，如果终端找不到命令，重新打开终端再执行。

可选地复制环境变量示例：

```bash
cp .env.example .env
```

没有 `.env` 时会使用 Mock Provider 启动，不需要任何模型密钥。

| 变量               | 默认值          | 用途                               |
| ------------------ | --------------- | ---------------------------------- |
| `NODE_ENV`         | `development`   | Server 运行环境                    |
| `SERVER_HOST`      | `127.0.0.1`     | Server 监听地址及 Web 开发代理目标 |
| `SERVER_PORT`      | `3001`          | Server 监听端口及 Web 开发代理目标 |
| `WEB_HOST`         | `127.0.0.1`     | Vite 监听地址                      |
| `WEB_PORT`         | `5173`          | Vite 开发端口                      |
| `AI_PROVIDER`      | `mock`          | `mock` 或 `deepseek`               |
| `DEEPSEEK_API_KEY` | 空              | DeepSeek 凭据，仅允许 Server 读取  |
| `DEEPSEEK_MODEL`   | `deepseek-chat` | DeepSeek 模型名称                  |
| `DATABASE_URL`     | 空              | 后续 SQLAlchemy/PostgreSQL 配置    |

`DEEPSEEK_API_KEY` 只能由 Server 读取，不要添加 `VITE_` 前缀或提交真实密钥。

## 启动

同时启动 Web 和 Server：

```bash
pnpm dev
```

默认地址：

- Web：`http://127.0.0.1:5173`
- Server：`http://127.0.0.1:3001`
- OpenAPI：`http://127.0.0.1:3001/docs`

也可以分别启动：

```bash
pnpm --filter @repo/web dev
pnpm --filter @repo/server dev
```

开发环境中，Vite 会根据 `SERVER_HOST` 和 `SERVER_PORT` 将 `/api` 代理到 Server。

## 项目文档

本文维护项目介绍、启动方式与架构原则；其余文档按职责维护，避免重复记录同一份清单。

| 文档                                 | 负责内容                                   |
| ------------------------------------ | ------------------------------------------ |
| [项目进度](./docs/project-status.md) | 当前实现、测试覆盖、后续任务优先级与非目标 |
| [开发交接](./docs/handoff.md)        | 最近改动、实际验证、阻塞和下一步           |
| [API 接口文档](./docs/api.md)        | 已实现接口与规划接口的契约、状态码         |
| [数据库设计](./docs/database.md)     | 规划中的实体、约束、索引和事务流程         |
| [协作说明](./AGENTS.md)              | 开始工作时的阅读顺序与开发约束             |

## 仓库结构

```text
apps/
  web/       Vue 3 前端
  server/    FastAPI / LangChain API
docs/
  api.md              API 接口说明
  database.md         数据库设计
  handoff.md          Codex 与跨设备开发交接
  project-status.md   实现进度与待办事项
```

## 检查命令

```bash
pnpm format:check
pnpm lint
pnpm test
pnpm build
```

当前 `pnpm lint` 负责 Web，`pnpm test` 会运行 Python Server 的 pytest。Python 的 Ruff、
Pyright 和完整格式检查将在后续工程化阶段接入。
