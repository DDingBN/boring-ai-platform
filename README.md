# Boring AI Platform

Boring AI Platform 是一个用于练习 AI 应用开发的全栈项目，采用 monorepo 管理 Vue Web、
FastAPI Server 和配套工程配置。

## 技术栈

- Web：Vue 3、Vite 8、Vue Router 4、Ant Design Vue 4、JavaScript
- Server：Python 3.13、FastAPI、Pydantic 2、LangChain
- Workspace：pnpm + Turborepo
- Python 工具链：uv

## 环境要求

- Node.js `22.12.0`
- pnpm `10.25.0`
- Python `3.13`
- uv `0.12` 或兼容版本

## 安装

```bash
pnpm install
uv sync --project apps/server
```

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

Vite 会根据 `SERVER_HOST` 和 `SERVER_PORT` 将 `/api` 代理到 Server。

## 项目文档

- [Codex/跨设备开发交接](./docs/handoff.md)
- [API 接口文档](./docs/api.md)
- [项目进度](./docs/project-status.md)
- [数据库设计](./docs/database.md)
- [Python 迁移记录与后续任务](./docs/python-migration.md)

## 仓库结构

```text
apps/
  web/       Vue 3 前端
  server/    FastAPI / LangChain API
docs/
  api.md              API 接口说明
  database.md         数据库设计
  handoff.md          Codex 与跨设备开发交接
  python-migration.md Python 迁移记录与后续任务
  project-status.md   实现进度与待办事项
```

Web 和 Server 保持前后端边界，只通过 HTTP JSON 协作；Web 使用 JavaScript，Server 使用
Python。

## 检查命令

```bash
pnpm format:check
pnpm lint
pnpm test
pnpm build
```

当前 `pnpm lint` 负责 Web，`pnpm test` 会运行 Python Server 的 pytest。Python 的 Ruff、
Pyright 和完整格式检查将在后续工程化阶段接入。

## 数据库状态

当前没有数据库运行时依赖、业务表或 migration。后续按
[数据库设计](./docs/database.md) 使用 SQLAlchemy 2、Alembic 和 PostgreSQL 实现。
