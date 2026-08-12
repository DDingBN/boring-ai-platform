# 项目进度

本文档记录 Boring AI Platform 的当前实现状态。功能发生变化时，应同步更新本页以及相关
API 文档。

## 已实现

### Web

- Vue 3、Vite、Vue Router 和 Ant Design Vue 基础工程。
- 响应式主布局、菜单、面包屑以及基础错误页面。
- Axios 请求封装和统一 API 响应解包。
- Chat 页面可以向 Server 发送消息。

### Server

- Express 5 和 TypeScript 基础工程。
- 健康检查、请求 ID、统一响应格式和错误处理。
- Chat 请求参数校验、会话 ID 生成和回声占位响应。
- Model 与 Conversation 规划接口返回明确的 `501 Not Implemented` 响应。
- Prisma 7 与 PostgreSQL 基础配置。

## 数据库状态

- Prisma Schema 暂无业务 model。
- 暂无 migration、数据库表或持久化逻辑。
- Prisma Client 生成到 `apps/server/generated/prisma`，生成目录不提交到 Git。
- 普通 API 启动不强制要求 `DATABASE_URL`；Prisma 数据库命令需要有效连接配置。

## 自动化测试

Server 测试当前覆盖：

- Health 响应。
- 请求 ID 生成与透传。
- 非法 JSON 和超大请求体处理。
- Chat 请求校验、会话 ID 和占位响应。
- 尚未实现接口的 `501` 响应。

Web 暂无自动化测试和独立类型检查。

## 待实现

- 在 Chat 页面渲染 Server 返回的助手消息，并补充加载、错误和重复提交状态。
- 接入真实 LLM provider。
- 设计数据库业务 model、migration 和持久化流程。
- 实现会话、消息和运行记录管理。
- 实现流式输出和请求取消。
- 为 Web 补充自动化测试和类型检查。
