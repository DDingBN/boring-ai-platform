# 开发交接

本页只保留当前接续快照；维护规则见 [协作说明](../AGENTS.md)。
完整能力与待办见 [项目进度](project-status.md)，启动方式见 [README](../README.md)。

## 当前快照

- 更新时间：2026-09-24。
- 本轮开始时 app/llm/mock.py 已修改，learning/provider_probe.py 为新增未跟踪文件，docs/handoff.md 已修改；助手移除探针临时错误调用并整理 Mock 文件空行，仅更新交接，未提交或 push。
- D10、D11 已验收；D12 按学习者意愿暂缓，未验收。M04 四个单元、M05 第一至第三单元已完成练习与验证。
- 原学习大纲：`C:\Users\DDingBN\Desktop\boring-notes\+\Boring AI Platform.md`；macOS 路径为 `/Users/ddingbn/Documents/ObsidianLibrary/boring-notes/+/Boring AI Platform.md`，跨设备需单独同步。
- 业务 API 仍无 SSE 接口或前端流解析。app/llm/mock.py 已能按两片产出文字，但尚未接入 Service 或 HTTP 路由。

## 最近完成

### 2026-09-24：M05 第三单元 Mock Provider 异步生成器

- 学习者保留 MockChatProvider.complete(content) 的普通完整回复，新增 stream(content) -> AsyncIterator[str]，分别 yield 固定前缀与实际输入；此前 `-> str` 类型冲突已纠正。
- 学习者新增 learning/provider_probe.py，用 async for 读取两片并拼接，对照 complete()；故意插入 `await provider.stream("你好")` 后观察到 TypeError：async_generator 不能直接 await。
- 助手移除探针临时错误行、整理 Mock 文件空行，恢复正常练习版本。异步生成器的 `yield` 产出 str，但调用函数得到的是异步迭代器；`await` 需要可等待对象，async for 在逐次取下一片时内部等待。

## 验证

- 之前在 apps/server 运行项目 Python -m pytest -q：8 passed，1 条依赖的 DeprecationWarning；新增 stream() 未改变普通聊天行为。
- 2026-09-24 移除临时错误行后复跑项目 Python -X utf8 -m learning.provider_probe：两片分别为“Python 服务端已收到：”和“你好”，拼接及 complete() 均为“Python 服务端已收到：你好”，退出码 0。
- 学习者提供误用 await 的实际 TypeError traceback；本轮执行 git diff --check 通过。未重跑 pytest、Web lint 或构建，因本轮只删除探针临时行并调整空行。
- 这些验证不代表模型真实流、业务 SSE 或网络逐段到达已实现；当前 Mock 两片之间没有等待。

## 阻塞与已知事项

- 无学习阻塞；D12 的依赖覆盖、fixture、pytest.raises 和测试替身不视为已掌握。
- 新的流式业务接口需要继续设计 Provider 能力、Service 输出、HTTP/SSE 路由以及与 DeepSeek 的兼容范围；保持现有普通 JSON Chat 契约。
- 一次 yield 不保证对应一次客户端读取；网络分片、UTF-8 增量解码和浏览器解析尚未教学。

## 下一步与接续

按 M05 大纲逐层接入 Service，再实现新的业务 SSE 路由。每个单元先讲必要概念、文件和命令，给小任务与提示，让学习者尝试后审查，并验证正常与失败；新增业务接口时同步 docs/api.md 与 docs/project-status.md。
后续再学习前端字节读取和 SSE 解析，不把独立练习或 Mock 方法描述为已接通的聊天流功能。
有改动时提醒提交并推送，未经明确要求不自行 push。
