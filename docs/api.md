# API 接口文档

## 基本信息

| 项目         | 值                      |
| ------------ | ----------------------- |
| Base URL     | `http://127.0.0.1:3001` |
| API 版本     | `v1`                    |
| Content-Type | `application/json`      |

所有响应均包含 `x-request-id` 响应头。

## 响应格式

成功响应：

```json
{
  "code": 200,
  "msg": "成功",
  "data": {}
}
```

错误响应：

```json
{
  "code": 400,
  "msg": "请求参数无效。",
  "data": {
    "requestId": "req_xxx"
  }
}
```

## 接口总览

| 模块         | 方法   | 路径                                             | 状态   |
| ------------ | ------ | ------------------------------------------------ | ------ |
| Health       | GET    | `/health`                                        | 已实现 |
| Model        | GET    | `/api/v1/models`                                 | 待实现 |
| Chat         | POST   | `/api/v1/chat/messages`                          | 已实现 |
| Conversation | GET    | `/api/v1/conversations`                          | 待实现 |
| Conversation | GET    | `/api/v1/conversations/:conversationId`          | 待实现 |
| Conversation | GET    | `/api/v1/conversations/:conversationId/messages` | 待实现 |
| Conversation | PATCH  | `/api/v1/conversations/:conversationId`          | 待实现 |
| Conversation | DELETE | `/api/v1/conversations/:conversationId`          | 待实现 |

## Health

### 健康检查

```http
GET /health
```

#### 响应

```json
{
  "code": 200,
  "msg": "成功",
  "data": {
    "ok": true
  }
}
```

## Model

### 获取模型列表

```http
GET /api/v1/models
```

## Chat

### 发送消息

```http
POST /api/v1/chat/messages
```

#### 请求参数

| 字段             | 类型   | 必填 | 约束          | 说明                    |
| ---------------- | ------ | ---- | ------------- | ----------------------- |
| `conversationId` | string | 否   | 1–100 个字符  | 会话 ID；首次发送时不传 |
| `content`        | string | 是   | 1–2000 个字符 | 用户输入内容            |

#### 请求示例

首次发送：

```json
{
  "content": "你好"
}
```

继续会话：

```json
{
  "conversationId": "conversation_123",
  "content": "继续刚才的话题"
}
```

#### 响应参数

| 字段                | 类型        | 说明              |
| ------------------- | ----------- | ----------------- |
| `conversationId`    | string      | 会话 ID           |
| `message.id`        | string      | 消息 ID           |
| `message.role`      | `assistant` | 消息角色          |
| `message.content`   | string      | 消息内容          |
| `message.createdAt` | string      | ISO 8601 创建时间 |

#### 响应示例

```json
{
  "code": 200,
  "msg": "成功",
  "data": {
    "conversationId": "conversation_123",
    "message": {
      "id": "message_123",
      "role": "assistant",
      "content": "你好，有什么可以帮助你？",
      "createdAt": "2026-08-12T10:00:00.000Z"
    }
  }
}
```

## Conversation

### 获取会话列表

```http
GET /api/v1/conversations
```

### 获取单个会话

```http
GET /api/v1/conversations/:conversationId
```

#### 路径参数

| 字段             | 类型   | 必填 | 说明    |
| ---------------- | ------ | ---- | ------- |
| `conversationId` | string | 是   | 会话 ID |

### 获取会话消息

```http
GET /api/v1/conversations/:conversationId/messages
```

#### 路径参数

| 字段             | 类型   | 必填 | 说明    |
| ---------------- | ------ | ---- | ------- |
| `conversationId` | string | 是   | 会话 ID |

### 修改会话

```http
PATCH /api/v1/conversations/:conversationId
```

#### 路径参数

| 字段             | 类型   | 必填 | 说明    |
| ---------------- | ------ | ---- | ------- |
| `conversationId` | string | 是   | 会话 ID |

### 删除会话

```http
DELETE /api/v1/conversations/:conversationId
```

#### 路径参数

| 字段             | 类型   | 必填 | 说明    |
| ---------------- | ------ | ---- | ------- |
| `conversationId` | string | 是   | 会话 ID |

## 状态码

| HTTP 状态码 | 说明         |
| ----------- | ------------ |
| `200`       | 请求成功     |
| `400`       | 请求参数错误 |
| `404`       | 资源不存在   |
| `413`       | 请求体过大   |
| `500`       | 服务端错误   |
| `501`       | 接口尚未实现 |
