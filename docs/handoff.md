# 开发交接

本页用于在 Windows、macOS 和不同会话之间传递最近工作上下文。架构原则与启动方式见
[README](../README.md)，完整能力和后续任务见 [项目进度](project-status.md)。
历史改动通过 Git 追溯，代码和测试是实现状态的最终依据。

## 当前快照

- 更新时间：2026-09-15。
- 分支：`main`。
- 本次基线：`a3d41b5 docs: 更新`；开始时工作区干净，与本地远程跟踪分支 `origin/main`
  无领先或落后提示。本次未 fetch、提交或 push。
- 当前目标：合并重复文档，统一架构原则、状态与任务的维护位置。
- 当前阶段：Vue + FastAPI 最小聊天闭环已经跑通，下一阶段尚未开始。
- 推荐的下一项任务：完成 SSE 流式聊天和前端请求取消，暂不同时展开数据库与 Agent。

## 最近完成

### 2026-09-15：文档整理

- `README.md` 收录迁移背景和四条架构原则，统一安装说明与文档导航。
- `docs/project-status.md` 合并 P0/P1/P2 后续任务、非目标及待补设计，保留原有任务细节。
- `docs/api.md` 明确 `501` 规划接口的参数与成功响应尚未实现；`docs/database.md`
  明确全文为待实现的数据设计。
- 移除已合并的独立迁移记录，同步 `AGENTS.md` 阅读顺序和文档维护约定。
- 本页精简为近期改动、验证和下一步；未改变业务实现或架构决策。

## 验证

### 本次文档检查

- 本地 Prettier 格式检查通过，覆盖 README、AGENTS 与四份 docs 文档。
- 文档结构检查通过：18 个仓库内链接有效，12 段 JSON 示例可解析，代码围栏配对完整。
- 旧文档引用检查和 `git diff --check` 通过；复核确认原有四项架构决策、任务细节及非目标已保留。
- `pnpm exec prettier` 在当前环境未能解析命令；改用
  `node node_modules/prettier/bin/prettier.cjs` 完成格式化与检查，未安装额外依赖。
- 本次只改文档，未重跑应用 lint、测试或构建。

### 上一次应用验证（2026-09-14）

以下是历史验收结果，不代表本次重新运行：

- Server：pytest `4 passed`；Web：ESLint 和 Vite 生产构建通过。
- 根目录：`pnpm lint`、`pnpm test`、`pnpm build` 通过。
- 联调：通过 Vite `/api` 代理完成两次 Chat 请求，确认 `conversationId` 保持不变；
  这不代表服务端保存或传递了历史上下文。
- DeepSeek：仅使用测试密钥完成本地初始化验证，未发起外部模型请求。

## 阻塞与已知事项

- 当前无阻塞。后续数据库阶段仍需补齐 RunStep、工具消息和审批状态的设计。
- 此前测试有 AnyIO deprecation warning；Vite 提示主 JavaScript chunk 超过 500 kB。
- Python `compileall` 不生成 `dist`，Turbo 会提示 Server build 没有匹配的输出文件。
- 全仓库格式规范化仍是后续任务，本次仅检查整理涉及的文档。

## 下一步与接续

先定义 SSE 事件协议，接通 Mock 流式输出、前端增量显示和取消，再验证超时、断开与错误状态。
具体任务优先级统一维护在 [项目进度](project-status.md)。

新设备先按 [协作说明](../AGENTS.md) 检查 Git 状态与阅读文档，再参考
[README](../README.md) 安装和启动。每次结束时更新本页的当前目标、已完成、验证、阻塞与下一步，
并按实际情况提交和推送。
