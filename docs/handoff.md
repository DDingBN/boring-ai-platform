# 开发交接

本页只保留当前接续快照，“最近完成”更新时覆盖旧记录；维护规则见
[协作说明](../AGENTS.md)。历史通过 Git 追溯，代码和测试是实现状态的最终依据。
完整能力与功能待办见 [项目进度](project-status.md)，启动方式见 [README](../README.md)。

## 当前快照

- 更新时间：2026-09-17。
- 分支与基线：`main`，`b8509e1 learn：1-4`；本次未 fetch、提交或 push。
- 工作区：进入本次整理时已有 `docs/handoff.md` 修改，以及未跟踪的
  `apps/server/learning/__init__.py`、`day05.py`、`day06_api.py`；学习代码保持原样。
- 学习进度：D06 最小 HTTP 接口已完成，下一课 D07 请求校验与项目错误响应。
- 原学习大纲：`C:\Users\DDingBN\Desktop\boring-notes\+\Boring AI Platform.md`，
  位于仓库外，跨设备需单独同步；本次没有调整学习计划。
- 项目阶段：Vue + FastAPI 最小聊天闭环已跑通；功能开发下一优先级为 SSE 流式聊天与取消。

## 最近完成

### 2026-09-17：D06 收尾与交接精简

- 练习文件为 `apps/server/learning/day06_api.py`，独立端口 3002。
  `EchoRequest` 仅声明 `content`，POST 回复中的 `source` 固定为“练习接口”。
- 学习者已区分请求字段与固定响应字段、路径不存在与方法不匹配；D06 正常与失败验证通过。
- 交接页改为只保留最新记录，并将覆盖更新、保留未解决事项的规则写入 `AGENTS.md`。

## 验证

- D06 此前实测：POST `/echo` 提交 `{"content":"你好"}`，返回 HTTP 200 与
  `{"message":"你好","source":"练习接口"}`。
- 学习者此前日志：GET `/hello` 返回 200，GET `/learning-not-found` 返回 404，
  GET `/echo` 返回 405；已正确解释原因，错误响应正文未另行提交。
- 本次仅修改文档，未重复发请求，未运行应用 lint、测试或构建。
- 本次文档检查：`AGENTS.md` 与本页的 Prettier 检查、`git diff --check` 均通过。

## 阻塞与已知事项

- 当前无阻塞。学习练习未接入正式业务 API，项目实现状态未变化。
- 后续教学继续先讲概念并明确文件、运行目录、命令和预期结果，再给提示让学习者尝试；
  收到代码或操作记录后审查，最后验证正常与失败。

## 下一步与接续

从 D07 开始：阅读 `apps/server/app/schemas/chat.py` 与 `apps/server/app/main.py`，
讲解长度限制、去除首尾空白、额外字段与命名映射，再使用正式项目端口 3001 验证合法和非法请求。
区分练习应用默认校验错误 422 与正式项目自定义校验错误 400；不修改生产校验规则。

新设备先按 [协作说明](../AGENTS.md) 检查 Git 状态与阅读文档。
结束时覆盖更新本页，并提醒提交和推送；未经用户明确要求不自行 push。
