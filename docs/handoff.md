# 开发交接

本页用于在 Windows、macOS 和不同 Codex 会话之间传递最近上下文。它只记录当前工作面，
长期事实以 `project-status.md`、`python-migration.md`、代码和测试为准。

## 当前快照

- 更新时间：2026-09-14。
- 分支：`main`。
- 记录前同步状态：本地与 `origin/main` 一致，基线提交为 `24be76a feat：rebuild`。
- 当前阶段：Vue + FastAPI 最小聊天闭环已经跑通，下一阶段尚未开始。
- 推荐的下一项任务：完成 SSE 流式聊天和前端请求取消，暂不同时展开数据库与 Agent。

## 最近完成

- 将原 Express/TypeScript Server 迁移为 Python 3.13、FastAPI、Pydantic 2 和 uv。
- 保留 `/api/v1`、统一响应结构、请求 ID 和前端调用方式。
- 增加 Mock Provider，以及基于 `langchain-deepseek` 的 DeepSeek Provider。
- Vue Chat 页面已能发送消息、显示回复并续传 `conversationId`。
- 增加 4 个 FastAPI 最小测试，覆盖 Health、Mock Chat、请求校验和统一 404。
- 清理旧 Prisma、TypeScript Server、React 依赖链接、无效配置和本地缓存。
- 验证 Windows 上 `pnpm lint`、`pnpm test` 和 `pnpm build` 通过。

## 当前未实现

- Chat 不是 SSE 流式响应，也不能取消正在进行的请求。
- Conversation 和 Model 接口仍返回 `501 Not Implemented`。
- 会话和消息没有数据库持久化。
- 当前 LangChain 只用于模型调用，尚未实现 `create_agent`、工具循环和 Agent 状态。
- 尚未接入 LangGraph、RAG、MCP、Trace、Eval、Docker 和 CI。
- Python 尚未接入 Ruff/Pyright，Web 尚无组件或 E2E 测试。

## 已知非阻塞事项

- Starlette TestClient 会输出一条依赖内部的 AnyIO deprecation warning。
- Vite 构建提示主 JavaScript chunk 超过 500 kB。
- Python `compileall` 不生成 `dist`，Turbo 会提示 Server build 没有匹配的输出文件。
- `pnpm format:check` 会发现仓库既有文件尚未统一格式化；规范化任务此前明确延后。
- 首次安装 uv 后可能需要重启 VS Code 或终端，确保 `uv` 已进入 PATH。

## 新设备或新会话开始步骤

```bash
git pull --ff-only
pnpm install --frozen-lockfile
uv sync --project apps/server
pnpm test
```

随后阅读本页和 `docs/project-status.md`，检查 `git status`，确认没有来自另一台设备的未提交
修改后再开始开发。默认使用 Mock Provider，不需要复制模型密钥。

## 本次会话结束时如何更新

直接修改本页对应章节，并至少记录：

- 本次目标以及实际完成内容。
- 修改过的核心文件或模块。
- 新增的架构决策和明确放弃的方案。
- 实际运行的验证命令与结果。
- 未解决问题、阻塞原因和推荐下一步。

更新完成后，将代码与文档放在同一次或紧邻的 Git 提交中并推送。另一台设备只需要 pull，
新的 Codex 会根据根目录 `AGENTS.md` 自动从本页恢复上下文。
