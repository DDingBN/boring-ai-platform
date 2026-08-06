# API

当前 Server 默认运行在 `http://127.0.0.1:3001`。所有响应都包含 `x-request-id` 响应头。

## `GET /health`

检查 HTTP 进程是否能够响应，不检查模型或数据库。

响应：

```json
{
  "ok": true
}
```

## `POST /api/chat`

当前是回声接口，不调用真实模型，也不保存消息。

请求：

```json
{
  "messages": [
    {
      "role": "user",
      "content": "你好"
    }
  ]
}
```

最后一条消息必须存在且 `role` 必须为 `user`。

成功响应：

```json
{
  "message": {
    "id": "server-generated-uuid",
    "role": "assistant",
    "content": "Server 已收到：你好",
    "createdAt": "2026-08-06T00:00:00.000Z"
  }
}
```

请求不符合当前条件时返回统一错误：

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid request.",
    "requestId": "req_xxx"
  }
}
```

当前接口尚未实现完整的运行时请求校验；调用方不能依赖 TypeScript 类型代替 HTTP 校验。
