# Codex 项目协作说明

本文档是所有 Codex 会话进入仓库后的统一入口。开始修改代码前，先获取 Git 状态并按顺序
阅读以下文档：

1. `docs/handoff.md`：学习者与助手的当前学习、带教进度、验收证据和下一步。
2. `docs/project-status.md`：当前已经实现和尚未实现的能力。
3. `README.md`：启动方式、架构与设计原则。
4. 按任务需要阅读 `docs/api.md` 或 `docs/database.md`。

学习与带学任务还需阅读 `docs/learning-outline.md` 的对应单元，按其中的先修、讲解、提示、
尝试、审查与验证顺序推进。学习大纲统一在仓库内维护，随 Git 同步；当前接续位置见
`docs/handoff.md`，不再依赖外部笔记路径。

代码是最终事实来源。如果代码、测试和文档不一致，先指出差异，再根据实际实现同步文档。
文档中标记为“待实现”或返回 `501` 的接口不能描述成已经完成。

## 项目基线

- Monorepo：pnpm 10 + Turborepo。
- Web：Vue 3、Vite 8、Vue Router、Ant Design Vue，当前使用 JavaScript。
- Server：Python 3.13、FastAPI、Pydantic 2、LangChain，使用 uv 管理。
- 调用边界：`Vue -> FastAPI`，不保留 Node 网关。
- 默认 `AI_PROVIDER=mock`，无需密钥；DeepSeek 是可选 Provider。
- 当前没有数据库、持久化会话、SSE、Agent 工具循环或 LangGraph 运行时。

## 常用命令

```bash
pnpm install --frozen-lockfile
uv sync --project apps/server
pnpm dev
pnpm lint
pnpm test
pnpm build
```

Windows Python 解释器位于 `apps/server/.venv/Scripts/python.exe`，macOS 位于
`apps/server/.venv/bin/python`。不要提交 `.env`、`.venv`、`node_modules`、缓存或构建产物。

## 实现约束

- 保持 `/api/v1`、`{ code, msg, data }` 和 `x-request-id` 兼容，除非任务明确要求破坏性变更。
- FastAPI 路由只处理 HTTP 边界，业务逻辑放入 `services`，模型适配放入 `llm`。
- 通过 FastAPI `Depends` 提供 Service，测试中使用 dependency override，避免真实模型调用。
- Python 内部使用 snake_case；HTTP JSON 继续使用 camelCase alias。
- 本地和自动化测试默认使用 Mock Provider，不发送真实 DeepSeek 请求。
- 新增或修改接口时同步更新 `docs/api.md`；改变实现状态时同步更新
  `docs/project-status.md`。
- 数据库设计变化同步更新 `docs/database.md`；架构原则变化同步更新 `README.md` 的
  “架构与设计原则”。需要详细记录的重大决策可新增 ADR，并从 README 链接。
- 后续任务和非目标统一维护在 `docs/project-status.md`；`docs/handoff.md` 只维护学习与带教接续，
  不记录一般项目开发进度、文档整理或学习者自行进行的项目调整。
- 课程结构、带学方式与学习验收要求维护在 `docs/learning-outline.md`；课程计划不能视为
  已实现能力，学习进展需有代码或验证证据。

## 学习交接文档维护规则

- `docs/handoff.md` 只维护学习者的学习进度与助手的带教进度，作为当前接续快照，
  不按会话或学习步骤累积日志。一般项目开发、文档迁移及学习者自行调整项目不写入本页。
- “最近完成”只保留最新一条学习单元记录；更新时覆盖旧记录，同一学习单元的多轮进展合并为最终结论。
- 仅保留下一次带学需要的学习目标、已讲与未讲内容、学习者完成与待验收项、
  相关练习文件、验收证据、未解决学习阻塞和明确下一步。
  尚未解决的问题继续保留，已被新结论取代的过程记录删除。
- “验证”只保留当前学习单元所需的最新验收证据，区分当次执行、此前验证和未执行的检查；
  不追加历次验证清单。历史通过 Git 追溯，不另建交接归档。

## 每次会话结束前

1. 在合理范围内运行 lint、测试和构建，并记录真实结果。
2. 仅在学习或带教进度变化时更新 `docs/handoff.md`，替换旧快照，确保“最近完成”只有最新一条学习记录。
   纯项目开发、文档整理或学习者自行调整项目时，不更新学习交接快照。
3. 必要时更新状态、API、数据库或架构文档。
4. 检查 `git status`，不要覆盖其他设备或用户尚未提交的修改。
5. 提醒用户提交并推送；除非用户明确要求，不自行向远程仓库 push。
