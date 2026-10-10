# 学习交接

本页只维护学习者的学习进度与助手的带教进度，供下一次带学接续。
维护规则见 [协作说明](../AGENTS.md)，课程与带学要求见 [学习大纲](learning-outline.md)。
项目实现状态与待办见 [项目进度](project-status.md)，启动方式见 [README](../README.md)。

## 当前学习位置

- 最近学习日期：2026-09-29。
- D10、D11 已验收；D12 按学习者意愿暂缓，未验收。
- M04 四个单元、M05 第一至第四单元已验收；下一步进入 M05 业务 HTTP/SSE 路由单元。
- 已完成流式 Provider 与 Service 的独立练习，尚未带教业务 HTTP/SSE 接入和前端流解析。
- 接续练习文件：`apps/server/app/llm/base.py`、`apps/server/app/services/stream_chat_service.py`、`apps/server/learning/service_probe.py`。

## 最近完成

### 2026-09-29：M05 第四单元流式 Service 正常与失败路径

- 学习者新增独立 StreamingChatProvider Protocol；StreamChatService 接收 ChatRequest，调用 Provider.stream(request.content)，用 async for/yield 原样转交文字。已学习流式 Service 与普通 ChatService 的职责区分。
- 学习者完成正常路径探针：读取 Mock 两片，断言拼接结果等于 complete()。
- 助手应学习者要求补充 FailingProvider：先 yield 一片，再 raise ValueError；探针捕获并断言第一片已到达且异常未被 Service 吞掉，完成正常与失败路径验收。

## 学习验收证据

- 当次在 `apps/server` 运行项目 Python `-X utf8 -m learning.service_probe`：正常两片拼接为“Python 服务端已收到：你好”；失败路径先输出“第一片：你好”，再输出“模拟中途失败”，两个断言通过，退出码 0。
- 此验收证明 Service 中的分片转交和异常传播；业务 HTTP 与 SSE error 映射尚未教学或验收。

## 学习阻塞与待补内容

- 无学习阻塞；D12 的依赖覆盖、fixture、pytest.raises 和测试替身不视为已掌握，后续使用前需补讲或提供已解释的示例。
- 当前 DeepSeekChatProvider 无 stream()；Mock/Service 练习不能视为完整流式聊天功能，接入时需单独说明 Provider 支持边界。
- 一次 yield 不保证对应一次客户端读取；网络分片、UTF-8 增量解码和浏览器解析尚未教学。

## 下一步带教

按 [学习大纲](learning-outline.md) 的 M05 进入业务 HTTP/SSE 路由单元：先解释独立练习与实际 `/api/v1` 的连接、Request ID 和响应契约，再给小任务与提示，逐步接入 Mock + StreamChatService。保持原 POST `/api/v1/chat/messages` 的 JSON 契约；DeepSeek 流式支持需单独处理，不能无声失败。
继续先讲、提示、尝试、审查和正常/失败验证，再进入前端字节读取与解析。
