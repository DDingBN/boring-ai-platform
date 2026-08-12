# Boring AI Platform

Boring AI Platform 是一个用于练习 AI 应用开发的全栈项目，采用 monorepo 管理 Vue Web、
Express Server 和配套工程配置。

## 技术栈

- Web：Vue 3、Vite 8、Vue Router 4、Ant Design Vue 4、JavaScript
- Server：Node.js 22、Express 5、Zod 4、TypeScript
- Workspace：pnpm + Turborepo

## 环境要求

- Node.js `22.12.0`
- pnpm `10.25.0`

## 安装

```bash
pnpm install
```

可选地复制环境变量示例：

```bash
cp .env.example .env
```

没有 `.env` 时也会使用默认值启动。

| 变量               | 默认值        | 用途                                     |
| ------------------ | ------------- | ---------------------------------------- |
| `NODE_ENV`         | `development` | Server 运行环境                          |
| `SERVER_HOST`      | `127.0.0.1`   | Server 监听地址及 Web 开发代理目标       |
| `SERVER_PORT`      | `3001`        | Server 监听端口及 Web 开发代理目标       |
| `WEB_HOST`         | `127.0.0.1`   | Vite 监听地址                            |
| `WEB_PORT`         | `5173`        | Vite 开发端口                            |
| `AI_PROVIDER`      | `deepseek`    | Server 模型提供商配置                    |
| `DEEPSEEK_API_KEY` | 空            | DeepSeek 凭据，仅允许 Server 读取        |
| `DATABASE_URL`     | 空            | Prisma/PostgreSQL 配置（API 启动时可选） |

`DEEPSEEK_API_KEY` 只能由 Server 读取，不要添加 `VITE_` 前缀或提交真实密钥。

## 启动

同时启动 Web 和 Server：

```bash
pnpm dev
```

默认地址：

- Web：`http://127.0.0.1:5173`
- Server：`http://127.0.0.1:3001`

也可以分别启动：

```bash
pnpm --filter @repo/web dev
pnpm --filter @repo/server dev
```

Vite 会根据 `SERVER_HOST` 和 `SERVER_PORT` 将 `/api` 代理到 Server。

## 项目文档

- [API 接口文档](./docs/api.md)
- [项目进度](./docs/project-status.md)

## 仓库结构

```text
apps/
  web/       Vue 3 前端
  server/    Express API
docs/
  api.md             API 接口说明
  project-status.md  实现进度与待办事项
```

Web 和 Server 保持前后端边界，只通过 HTTP JSON 协作；Web 使用 JavaScript，Server 使用
TypeScript。

## 检查命令

```bash
pnpm format:check
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## 数据库工具

配置有效的 `DATABASE_URL` 后，可以校验 Schema、生成 Prisma Client 并检查数据库连接：

```bash
pnpm --filter @repo/server db:validate
pnpm --filter @repo/server db:generate
printf 'SELECT 1;\n' | pnpm --filter @repo/server exec prisma db execute --stdin
```

生成的 Prisma Client 位于 `apps/server/generated/prisma`，该目录不会提交到 Git。
