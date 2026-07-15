# Boring AI Platform

Boring AI Platform 是一个使用 pnpm workspace 和 Turborepo 管理的 AI 工作台项目，目标是逐步
实现 Chat、运行追踪、知识库、Workflow、Tools 和 Agents。

当前仓库已经具备可运行的 Web/Server 脚手架、统一环境配置、HTTP 基础中间件以及工程质量
检查；真实 Chat API、模型调用、数据库持久化和 Workflow Runtime 尚未实现。当前进度以
[实现状态](./docs/current-status.md)和[开发路线图](./docs/roadmap.md)为准。

## 1. 环境要求

- Node.js `22.12.0`
- pnpm `10.25.0`

先确认本机版本：

```bash
node --version
pnpm --version
```

如果尚未启用 pnpm，可以使用 Node.js 自带的 Corepack：

```bash
corepack enable
corepack prepare pnpm@10.25.0 --activate
```

## 2. 安装项目

所有安装命令都应在仓库根目录执行：

```bash
pnpm install
```

项目使用 `pnpm-lock.yaml` 固定依赖版本。不要在子目录单独使用 npm 或 yarn 安装依赖。

## 3. 配置环境变量

复制本地配置模板：

```bash
cp .env.example .env
```

即使没有 `.env`，项目也能使用默认配置启动；复制模板便于明确记录本地设置。

| 变量               | 默认值        | 当前用途                                                  |
| ------------------ | ------------- | --------------------------------------------------------- |
| `NODE_ENV`         | `development` | Server 运行环境，可选 `development`、`test`、`production` |
| `SERVER_HOST`      | `127.0.0.1`   | Server 监听地址                                           |
| `SERVER_PORT`      | `3001`        | Server 监听端口                                           |
| `WEB_HOST`         | `127.0.0.1`   | Vite 开发和预览监听地址                                   |
| `WEB_PORT`         | `5173`        | Vite 开发服务端口                                         |
| `AI_PROVIDER`      | `deepseek`    | 当前允许的模型 Provider 配置                              |
| `DEEPSEEK_API_KEY` | 空            | 仅供 Server 读取；真实 Provider 尚未接入                  |
| `DATABASE_URL`     | 空            | 数据库接入前可留空；设置时会校验 URL 和协议               |

安全约束：

- `.env` 已被 Git 忽略，不要提交真实密钥或连接字符串。
- `DEEPSEEK_API_KEY` 只能由 Server 读取，禁止添加 `VITE_` 前缀。
- `.env.example` 只保存无密钥的示例值。
- Server 和 Web 默认只绑定 `127.0.0.1`，不会直接暴露到局域网。

## 4. 启动开发环境

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

`pnpm dev` 是持续运行命令；使用 `Ctrl + C` 停止服务。

## 5. 检查是否启动成功

### 检查 Server

```bash
curl -i http://127.0.0.1:3001/health
```

响应状态应为 `200`，响应头包含 `x-request-id`，响应体为：

```json
{
  "ok": true
}
```

`/health` 是进程存活检查，不检查数据库或模型 Provider。

### 检查 Web

在浏览器访问 `http://127.0.0.1:5173`，应进入首页；访问 `/chat` 可以看到当前的本地 Mock
对话页面。

Web 和 Server 目前尚未通过 `/api` 代理或 API Client 连通，因此 Mock Chat 不会调用后端。

## 6. 常用命令

在仓库根目录执行：

| 命令                | 用途                                    |
| ------------------- | --------------------------------------- |
| `pnpm dev`          | 启动所有开发服务                        |
| `pnpm test`         | 运行已有测试；当前覆盖 Server HTTP 基线 |
| `pnpm lint`         | 检查所有 workspace 的代码规范           |
| `pnpm typecheck`    | 检查所有 workspace 的 TypeScript 类型   |
| `pnpm build`        | 构建 Web 和 Server                      |
| `pnpm format:check` | 检查格式，不修改文件                    |
| `pnpm format`       | 使用 Prettier 格式化仓库文件            |

提交代码前建议至少运行：

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm build
pnpm format:check
```

## 7. 生产构建与本地预览

构建整个仓库：

```bash
pnpm build
```

构建并启动 Server：

```bash
pnpm --filter @repo/server build
pnpm --filter @repo/server start
```

构建并预览 Web：

```bash
pnpm --filter @repo/web build
pnpm --filter @repo/web preview
```

Vite Preview 的实际地址以终端输出为准，默认端口通常为 `4173`。

## 8. 仓库结构

```text
apps/
  web/        React + Vite 前端
  server/     Express HTTP API
packages/
  shared/     Web 与 Server 共享的 TypeScript 契约
  ai/         AI Runtime 边界，目前只有类型占位
  database/   数据访问边界，目前只有类型占位
docs/         当前状态、模块设计、API 规范和路线图
```

模块边界：

- `apps/web` 负责页面、交互和 API 调用，不读取服务端密钥。
- `apps/server` 负责 HTTP、请求校验、业务编排和安全错误响应。
- `packages/shared` 只存放跨端契约，不暴露 Express、数据库或 Provider SDK 类型。
- `packages/ai` 承载模型、Embedding、RAG、Tools 和 Workflow 执行能力。
- `packages/database` 承载 schema、client 和 repositories；当前尚未接入 Prisma。

新增 Server 业务接口时，将 Router 注册在 `createApp()` 的 404 和错误中间件之前，并把业务
逻辑放入 service 或对应 package。详细约束见 [Server 模块设计](./docs/modules/server.md)。

## 9. 常见问题

### 端口被占用

在 `.env` 中修改 `SERVER_PORT` 或 `WEB_PORT`，然后重新启动。端口必须是 `1` 到 `65535` 的
整数。

### Server 启动时配置校验失败

根据终端错误检查 `.env`。配置错误会在监听端口前终止启动；错误信息不会回显密钥或数据库
连接字符串。

### Web 页面能打开，但请求不到 Server

当前 Web 仍是 Mock 界面，尚未配置 `/api` 代理和真实 API Client。这是下一阶段业务开发内容，
不是本地安装失败。

### 修改代码后检查未通过

先运行 `pnpm format` 修复格式，再根据 `pnpm lint` 和 `pnpm typecheck` 输出定位具体 workspace。

## 10. 进一步阅读

- [当前实现状态](./docs/current-status.md)
- [开发路线图](./docs/roadmap.md)
- [项目结构与路线规划](./docs/项目结构与路线规划.md)
- [接口设计规范](./docs/api/interface-design-spec.md)
- [Web 模块设计](./docs/modules/web.md)
- [Server 模块设计](./docs/modules/server.md)
- [Shared 契约设计](./docs/modules/shared.md)
- [AI Runtime 模块设计](./docs/modules/ai.md)
- [Database 模块设计](./docs/modules/database.md)
