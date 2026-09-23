# 开发交接

本页只保留当前接续快照；维护规则见 [协作说明](../AGENTS.md)。
完整能力与待办见 [项目进度](project-status.md)，启动方式见 [README](../README.md)。

## 当前快照

- 更新时间：2026-09-23。
- 本轮开始时 docs/handoff.md 已修改，learning/stream_api.py 为学习者新增且未跟踪；助手本轮将练习文件恢复为正常序列并更新交接，未提交或 push。
- D10、D11 已验收；D12 按学习者意愿暂缓，未验收。M04 四个单元已验收。
- M05 第一单元已完成：独立 HTTP 流练习的正常与固定失败序列均通过真实请求验证，失败实验后已恢复正常版本；学习者完成概念复述，经术语纠正后结案。
- 原学习大纲：`C:\Users\DDingBN\Desktop\boring-notes\+\Boring AI Platform.md`；macOS 路径为 `/Users/ddingbn/Documents/ObsidianLibrary/boring-notes/+/Boring AI Platform.md`，跨设备需单独同步。
- 项目仍无 SSE 业务接口或前端流解析。docs/api.md 的 SSE 契约为待实现学习设计。

## 最近完成

### 2026-09-23：M05 第一单元独立 HTTP 流练习验证

- 学习者在独立的 learning/stream_api.py 实现 GET /stream。正常版本按 start → delta → delta → done 输出，事件之间约一秒；响应头 requestId 与 start 一致。
- 固定失败实验先在 yield error 后 raise ValueError，导致连接异常关闭、curl 报错 18；学习者改为 return 后，start → delta → error 完整发送，连接正常结束，不发送 done。
- 助手在失败实验后恢复正常序列，并将第二段文字调整为“我是 Mock。”；该文件仍是独立学习应用，未注册到业务 API。固定失败模拟不代表真实异常捕获已实现。
- 学习者正确指出 HTTP 200 不代表后续流内回复成功；澄清 curl 是客户端程序，退出码 0 只表示传输完整，SSE done/error 才表示回复结果。

## 验证

- 本轮经 curl.exe -N -i --trace-time --trace-ascii - 对本机 3002 端口进行真实 HTTP 验证：状态 200，content-type 为 text/event-stream，x-request-id 为 req_demo_001；start、两条 delta、done 分别约在 11:11:07.616、08.626、09.639、10.645 收到，退出码 0。
- 初次失败版的异常证据：11:16:10.280 start、11:16:11.286 delta、11:16:12.300 error；HTTP 200，但连接中断，curl 报错 18，退出码 1。
- 修正失败版的 HTTP 验证：11:18:04.405 start、11:18:05.415 delta、11:18:06.425 error，随后完整关闭；HTTP 200，未收到 done，curl 退出码 0。
- 恢复正常版的 HTTP 复验：11:18:37.153 start、11:18:38.162 delta、11:18:39.167 delta、11:18:40.169 done；完整关闭，curl 退出码 0。
- 尝试另起 uvicorn 时发现 3002 已被占用；直接请求该端口成功，返回内容与当前练习代码一致。未读取占用进程身份，故证据严格说只确认该端口的服务响应。
- 本轮未运行 pytest、Web lint 或构建；仅独立学习文件和文档变化，执行 git diff --check。
- 此前 M04 的正常/固定失败事件序列已验收；sse_flow.py 当前保留固定失败样例。stream_basics.py、stream_async.py 保留主动失败示例。
- 学习者未提供自己的终端记录；助手的真实 HTTP 验证已覆盖本单元正常与固定失败行为，学习者已通过问答解释关键状态区别。

## 阻塞与已知事项

- 无学习阻塞；D12 的依赖覆盖、fixture、pytest.raises 和测试替身不视为已掌握。
- 继续巩固：空行结束当前事件；done/error 结束整个回复。完整 delta 可立即显示，不能因此判定回复成功；连接结束也不等于成功。
- 一次 yield 不保证对应一次客户端读取；网络分片、UTF-8 增量解码、解析器与真实异常到 SSE 的映射尚未教学。

## 下一步与接续

下一单元按大纲逐步推进 Mock 与业务分层，随后才进入前端字节读取及解析；尚未教学网络分片和真实异常映射。继续按先讲、提示、尝试、审查、正常与失败验证的节奏。
有改动时提醒提交并推送，未经明确要求不自行 push。
