# 开发交接

本页只保留当前接续快照；维护规则见 [协作说明](../AGENTS.md)。
完整能力与待办见 [项目进度](project-status.md)，启动方式见 [README](../README.md)。

## 当前快照

- 更新时间：2026-09-22。
- 本轮开始时 docs/handoff.md 已修改，学习者新增 sse_flow.py 尚未跟踪；助手本轮仅修改文档，未提交或 push。
- D10、D11 已验收；D12 按学习者意愿暂缓，未验收。
- M04 四个单元已完成带学与练习验收；终态规则和单事件边界曾混淆，经反馈纠正，M05 起步时简短复习。
- 下一起点为 M05 第一个单元：通过独立 HTTP 接口发送固定 SSE 事件，再逐步接入页面。
- 原学习大纲：`C:\Users\DDingBN\Desktop\boring-notes\+\Boring AI Platform.md`；macOS 路径为 `/Users/ddingbn/Documents/ObsidianLibrary/boring-notes/+/Boring AI Platform.md`，跨设备需单独同步。
- 项目仍无 SSE 业务接口或前端流解析。M04 事件约定已写入 docs/api.md 的待实现学习设计，不代表业务功能完成。

## 最近完成

### 2026-09-22：M04 事件流程与边界辨析收尾

- 第一、第二单元：普通及异步生成器的正常/中途失败输出已验证；文件 stream_basics.py、stream_async.py 保留主动失败示例。
- 第三单元：sse_format.py 正常编码、缺少空行观察已验证，代码已恢复双换行。函数返回字符串，由调用者打印。
- 第四单元：sse_flow.py 正常序列 start → 两条 delta → done 与固定失败序列 start → delta → error 均已运行通过。当前文件保留失败样例；done_event 被编码但未打印，不构成发送成功事件。
- 学习者最初把终态后的事件当作可重新改变状态，经解释后正确识别 done 之后的 delta 违法。
- 学习者曾认为完整 delta 也要等 done/error 才能处理。经区分“空行结束当前事件”和“done/error 结束整个回复”后，已正确回答：完整 delta 能显示，但不能标记整个回复成功。
- 状态表与最小事件字段记录于 docs/api.md：start 带 requestId，delta 带 text，done 为空对象，error 带 message。普通 JSON 契约保留。

## 验证

- 本轮仅更新文档，执行 git diff --check；未重跑 Python、pytest、Web lint 或构建。
- 此前在 apps/server 用项目 Python -X utf8 运行 sse_flow.py，正常与固定失败版本均退出码 0，字段、事件顺序及空行符合预期。沙箱启动曾被拒，经提权执行成功。
- 第三单元正常编码此前由助手运行；缺少空行输出由学习者提供。前两单元正常和异常输出由学习者提供并核对本地代码。
- 状态和边界理解经本会话问答确认；没有实际 HTTP 流、浏览器解析或网络分片验证，不将固定 error 文本视为真实异常处理已实现。

## 阻塞与已知事项

- 无学习阻塞；D12 暂缓，不将依赖覆盖、fixture、pytest.raises 或测试替身视为已掌握。
- 事件边界/回复终止是需要在 M05 复习的重点；解析器实现与异常到 SSE 事件的映射尚未教学。

## 下一步与接续

按原大纲进入 M05 第一个单元，先提供独立流接口起步示例、具体文件和运行目录，再观察固定事件的实际到达。
使用独立练习应用及端口，不直接注册为业务 API。后续使用 fetch 前补字节、UTF-8 增量解码和网络读取不等于事件边界的实验。
继续先讲必要概念、给提示、让学习者尝试后审查，正常和失败均留下真实证据；不提前代写完整作业。
有改动时提醒提交并推送，未经明确要求不自行 push。
