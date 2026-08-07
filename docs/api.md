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
请求由 Zod 在运行时校验，最多包含 100 条消息；每条消息的 `content` 去除首尾空白后
必须非空，且最多包含 32,000 个字符。

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

请求体不符合 schema 或最后一条消息不是用户消息时，Server 返回 `400`。
