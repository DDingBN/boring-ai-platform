# Web 模块设计

> 当前 Web 是可启动的界面脚手架，Chat、登录和首页数据仍为本地占位；本文后半部分描述下一阶段目标。

## 1. 模块职责

`apps/web` 是项目的主要操作界面，负责把 AI 运行过程展示成可理解、可调试、可复用的工作台。

早期不要把它做成普通后台首页。更合适的方向是：

- 中心是可操作的 chat / RAG / workflow。
- 侧边展示会话、知识库、运行记录等上下文。
- 右侧或抽屉展示运行调试信息。

## 2. 当前实现

技术栈为 React 19、Vite 8、React Router 7 和 Ant Design 6。

当前页面与路由：

| 路由                   | 页面           | 当前行为                                                         |
| ---------------------- | -------------- | ---------------------------------------------------------------- |
| `/`                    | -              | 重定向到 `/home`                                                 |
| `/home`                | `Home`         | 展示静态首页、Mock 指标、按钮和时间线，按钮没有业务行为          |
| `/chat`                | `ChatPage`     | 使用 React 本地状态；发送后立即生成固定 Mock 回复，不请求 Server |
| `/login`               | `Login`        | 展示表单，没有认证提交逻辑                                       |
| `/403`、`/404`、`/500` | 错误页         | 展示对应错误状态                                                 |
| 其他路径               | `NotFoundPage` | 在主布局内展示 404                                               |

当前主布局包含可折叠侧栏、菜单、面包屑、Header、Content 和 Footer。菜单数据位于
`src/data/menuData.ts`，页面组件注册位于 `src/data/routeRegistry.tsx`；为菜单项增加页面时，
需要同步维护这两处。菜单权限字段和过滤逻辑已预留，但应用还没有认证或权限上下文。

Vite 从仓库根目录读取 `.env`：`WEB_HOST` 默认 `127.0.0.1`，`WEB_PORT` 默认 `5173`。
当前没有 `/api` proxy、`src/api` 目录、请求库或 SSE parser，因此 Web 与 Server 尚未连通。

## 3. 页面优先级

| 路由         | 阶段   | 目标                                             |
| ------------ | ------ | ------------------------------------------------ |
| `/chat`      | 进行中 | 已有 Mock 对话；待接模型、模型选择和运行调试信息 |
| `/runs`      | 优先   | 查看 chat、RAG、tool、workflow 的运行记录        |
| `/knowledge` | 中期   | 管理知识库、上传文档、查看 chunks                |
| `/workflows` | 中期   | 创建、编辑、保存和运行 workflow                  |
| `/settings`  | 后期   | 配置 provider、模型和本地环境                    |

当前首页使用了工作流数、知识库数、今日调用和成功率等 Mock 指标。接入真实数据前应明确标注占位，
或者将首页保持轻量；不要让这些数值被误认为服务端统计。

## 4. Chat Workbench 目标

`/chat` 不应只是消息列表。建议布局为：

- 左侧：会话列表和新建会话入口。
- 中间：消息列表、输入框、模型选择器。
- 右侧：Run Inspector。

Run Inspector 展示：

- request messages
- model config
- latency
- token usage
- raw response
- error
- 后续扩展的 retrieved chunks
- 后续扩展的 tool calls

这样最小 chat 阶段就能沉淀后续 RAG、workflow 和 agent 需要的调试体验。

## 5. API 和状态管理

建议新增 `src/api/`，按业务域拆分：

```txt
apps/web/src/api/
  chat.api.ts
  runs.api.ts
  knowledge.api.ts
  workflows.api.ts
```

页面组件不直接散落 `fetch`。API 层统一处理：

- base URL
- JSON 序列化
- API error
- SSE stream parsing
- request abort

早期可以先用 React 本地状态。等会话、运行记录、知识库页面形成共享状态后，再考虑引入专门的数据请求库。

## 6. UI 原则

- 页面第一屏放真实工作流，不做营销式 landing page。
- 页面文案围绕用户当前任务，不写大量功能说明。
- 表格、日志、调试面板保持信息密度，适合反复查看。
- 图编辑器在 workflow runtime 稳定后再加，不要先做复杂 UI 壳。
- mock 数据只用于占位开发，进入真实 API 后应尽快删除。

## 7. 暂缓项

- 团队成员邀请。
- 多租户和权限管理 UI。
- 大屏 dashboard。
- 复杂 agent 编排视图。
- 与真实运行记录无关的统计卡片。
