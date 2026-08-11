# API

当前 Server 默认运行在 `http://127.0.0.1:3001`。所有响应都包含 `x-request-id` 响应头。

## `GET /health`

检查 HTTP 进程是否能够响应，不检查模型或数据库。

响应：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "ok": true
  }
}
```

## `POST /api/v1/chat/messages`

当前是回声接口，不调用真实模型，也不保存消息。

请求：

```json
{
  "content": "你好"
}
```

请求由 Zod 在运行时校验，并且只接受以下字段：

- `conversationId`：可选，会话标识；首次请求省略时由服务端创建，后续请求传回该值
- `content`：必填，本次用户输入；去除首尾空白后必须非空，最多 2,000 个字符

前端不传 `role` 或完整消息历史。服务端将 `content` 视为 `user` 消息；接入会话存储后，
服务端通过 `conversationId` 加载历史上下文。

成功响应：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "conversationId": "server-generated-conversation-uuid",
    "message": {
      "id": "server-generated-message-uuid",
      "role": "assistant",
      "content": "Server 已收到：你好",
      "createdAt": "2026-08-06T00:00:00.000Z"
    }
  }
}
```

请求不符合当前条件时返回统一错误：

```json
{
  "code": 400,
  "msg": "Invalid request.",
  "data": {
    "requestId": "req_xxx"
  }
}
```

`code: 200` 表示业务成功。请求体缺少必填字段、字段内容不符合限制或包含约定之外的字段时，
Server 返回 HTTP `400`，响应体中的 `code` 同样为 `400`。

## 规划中的占位接口

以下接口已经注册，但业务逻辑尚未实现，当前统一返回 HTTP `501`：

- `GET /api/v1/models`
- `GET /api/v1/conversations`
- `GET /api/v1/conversations/:conversationId`
- `GET /api/v1/conversations/:conversationId/messages`
- `PATCH /api/v1/conversations/:conversationId`
- `DELETE /api/v1/conversations/:conversationId`

占位响应：

```json
{
  "code": 501,
  "msg": "Not implemented.",
  "data": {
    "requestId": "req_xxx"
  }
}
```
