# 开发交接

本页只保留当前接续快照；维护规则见 [协作说明](../AGENTS.md)。
完整能力与待办见 [项目进度](project-status.md)，启动方式见 [README](../README.md)。

## 当前快照

- 更新时间：2026-09-23。
- 本轮开始时 stream_api.py 已修改，mock_stream.py 为新增未跟踪文件，docs/handoff.md 已修改；助手完成练习审查、正常与失败实测、恢复正常版本，并更新本页与 docs/api.md。未提交或 push。
- D10、D11 已验收；D12 按学习者意愿暂缓，未验收。M04 四个单元、M05 第一和第二单元已完成练习与行为验证。
- 原学习大纲：`C:\Users\DDingBN\Desktop\boring-notes\+\Boring AI Platform.md`；macOS 路径为 `/Users/ddingbn/Documents/ObsidianLibrary/boring-notes/+/Boring AI Platform.md`，跨设备需单独同步。
- 项目业务 API 仍无 SSE 接口或前端流解析。独立学习接口位于 learning/stream_api.py；docs/api.md 的业务 SSE 契约仍待实现。

## 最近完成

### 2026-09-23：M05 第二单元 Mock 分片与异常映射

- 学习者新增 learning/mock_stream.py：mock_parts() 按约一秒间隔 yield 两片纯文字；直接运行的 main() 用 async for 打印。路由从 learning.mock_stream 导入，generate_events() 把分片编码为 SSE delta，并发送 start/done。
- 先排除错误的顶层模块导入；再清理路由内重复等待和未使用的 full_text，使节奏由 Mock 控制。
- 学习者在 Mock 第二片前抛出 ValueError，路由在 async for 外捕获、yield error 后 return。失败流不发 done，连接正常结束。
- 助手移除临时抛错条件，保留异常映射逻辑，并修正 except 块缩进。当前练习文件为正常输出版本，未注册业务 API。

## 验证

- 失败版：直接运行 mock_stream.py 在第一片后抛 ValueError，退出码 1；真实 HTTP 请求在 16:01:55.132 收到 start、56.146 收到 delta、57.160 收到 error，HTTP 200，未收到 done，完整关闭，curl 退出码 0。
- 恢复正常版：真实 HTTP 请求在 16:02:46.869 收到 start、47.869 与 48.884 收到两条 delta，随后 done；完整关闭，curl 退出码 0。首片在完成前约一秒到达。
- 本轮执行 git diff --check 通过；未运行 pytest、Web lint 或构建，因为变化限于独立学习文件和文档。
- 上述验证只覆盖本地独立练习；不代表真实模型、业务路由或浏览器 SSE 已接通。

## 阻塞与已知事项

- 无学习阻塞；D12 的依赖覆盖、fixture、pytest.raises 和测试替身不视为已掌握。
- HTTP 200 与 curl 退出码 0 不表示流内回复成功；看 SSE done/error。未捕获异常会异常关闭连接，已捕获的本地 Mock ValueError 可转成 error 并正常结束。
- 一次 yield 不保证对应一次客户端读取；网络分片、UTF-8 增量解码和浏览器解析尚未教学。

## 下一步与接续

按 M05 大纲进入后续业务接入单元：先说明 app/llm、services、api 路由的分工与现有普通 Chat 契约，再在 Mock 基础上逐层实现流式业务接口。保持 `/api/v1`、普通 JSON 响应和请求 ID 兼容；新业务接口及状态改变时同步 docs/api.md 和 docs/project-status.md。
继续按先讲、提示、尝试、审查、正常与失败验证的节奏；后续再进入前端字节读取与 SSE 解析。
有改动时提醒提交并推送，未经明确要求不自行 push。
