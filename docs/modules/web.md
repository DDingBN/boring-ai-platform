# Web 模块设计

## 1. 模块职责

`apps/web` 是项目的主要操作界面，负责把 AI 运行过程展示成可理解、可调试、可复用的工作台。

早期不要把它做成普通后台首页。更合适的方向是：

- 中心是可操作的 chat / RAG / workflow。
- 侧边展示会话、知识库、运行记录等上下文。
- 右侧或抽屉展示运行调试信息。

## 2. 页面优先级

| 路由         | 阶段 | 目标                                      |
| ------------ | ---- | ----------------------------------------- |
| `/chat`      | 优先 | 与模型对话，选择模型，查看运行调试信息    |
| `/runs`      | 优先 | 查看 chat、RAG、tool、workflow 的运行记录 |
| `/knowledge` | 中期 | 管理知识库、上传文档、查看 chunks         |
| `/workflows` | 中期 | 创建、编辑、保存和运行 workflow           |
| `/settings`  | 后期 | 配置 provider、模型和本地环境             |

首页可以先保持轻量，或者直接重定向到 `/chat`。不要在没有真实数据前构造调用量、成功率、任务数等指标。

## 3. Chat Workbench

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

## 4. API 和状态管理

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

## 5. UI 原则

- 页面第一屏放真实工作流，不做营销式 landing page。
- 页面文案围绕用户当前任务，不写大量功能说明。
- 表格、日志、调试面板保持信息密度，适合反复查看。
- 图编辑器在 workflow runtime 稳定后再加，不要先做复杂 UI 壳。
- mock 数据只用于占位开发，进入真实 API 后应尽快删除。

## 6. 暂缓项

- 团队成员邀请。
- 多租户和权限管理 UI。
- 大屏 dashboard。
- 复杂 agent 编排视图。
- 与真实运行记录无关的统计卡片。
