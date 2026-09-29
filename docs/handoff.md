# 开发交接

本页只保留当前接续快照；维护规则见 [协作说明](../AGENTS.md)。
完整能力与待办见 [项目进度](project-status.md)，启动方式见 [README](../README.md)。

## 当前快照

- 更新时间：2026-09-29。
- 本轮开始时 app/llm/base.py 已修改，app/services/stream_chat_service.py 与 learning/service_probe.py 为新增未跟踪文件，docs/handoff.md 已修改；助手按学习者要求补全失败探针并更新文档，未提交或 push。
- D10、D11 已验收；D12 按学习者意愿暂缓，未验收。M04 四个单元、M05 第一至第四单元已验收。
- 原学习大纲：`C:\Users\DDingBN\Desktop\boring-notes\+\Boring AI Platform.md`；macOS 路径为 `/Users/ddingbn/Documents/ObsidianLibrary/boring-notes/+/Boring AI Platform.md`，跨设备需单独同步。
- Mock Provider 和 StreamChatService 可逐片产出文字，但业务 API 仍无 SSE 接口或前端流解析；DeepSeek Provider 仍只有普通 complete()。

## 最近完成

### 2026-09-29：M05 第四单元流式 Service 正常与失败路径

- 学习者在 app/llm/base.py 新增独立 StreamingChatProvider Protocol；StreamChatService 接收 ChatRequest、调用 Provider.stream(request.content)，用 async for/yield 原样转交文字。原 ChatProvider 与普通 ChatService 保持原有职责。
- learning/service_probe.py 的正常路径读取 Mock 两片并断言拼接结果等于 complete()。助手应学习者要求补充 FailingProvider：先 yield 一片、再 raise ValueError；探针捕获并断言第一片已到达且异常未被 Service 吞掉。
- 助手整理 base.py 导入顺序，删除 Service 占位注释；未接业务 HTTP 路由。

## 验证

- 本轮在 apps/server 运行项目 Python -X utf8 -m learning.service_probe：正常两片拼接为“Python 服务端已收到：你好”；失败路径先输出“第一片：你好”，再输出“模拟中途失败”，两个断言通过，退出码 0。
- 此前本工作面运行项目 Python -m pytest -q：8 passed，1 条依赖的 DeprecationWarning。本轮只新增探针失败分支与文档，未重复跑 pytest；未运行 Web lint 或构建。
- git diff --check 通过。探针验证的是 Service 中的异常传播，尚无 HTTP 或 SSE error 映射证据。

## 阻塞与已知事项

- 无学习阻塞；D12 的依赖覆盖、fixture、pytest.raises 和测试替身不视为已掌握。
- 当前 DeepSeekChatProvider 无 stream()；不能把 Mock/Service 练习描述成完整流式聊天功能。
- 一次 yield 不保证对应一次客户端读取；网络分片、UTF-8 增量解码和浏览器解析尚未教学。

## 下一步与接续

按 M05 大纲进入业务 HTTP/SSE 路由单元：先解释独立练习与实际 `/api/v1` 的连接、Request ID 和响应契约，再给小任务与提示，逐步接入 Mock + StreamChatService。保持原 POST `/api/v1/chat/messages` 的 JSON 契约；DeepSeek 流式支持需单独处理，不能无声失败。新增业务接口时同步 docs/api.md 与 docs/project-status.md。
继续先讲、提示、尝试、审查和正常/失败验证，再进入前端字节读取与解析。
有改动时提醒提交并推送，未经明确要求不自行 push。
