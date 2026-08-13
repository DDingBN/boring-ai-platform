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

### 1.健康检查

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

### 1.获取模型列表

```http
GET /api/v1/models
```

## Chat

### 1.发送消息

```http
POST /api/v1/chat/messages
```

#### Body 参数

| 字段              | 类型   | 必填 | 约束         | 说明                 |
| ---------------- | ------ | --- | ------------ | ------------------- |
| `conversationId` | string | 否  | 1–100 个字符  | 会话 ID；首次发送时不传 |
| `content`        | string | 是  | 1–2000 个字符 | 用户输入内容           |

#### Body 示例

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
| `message.role`      | string      | 消息角色          |
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

### 1.获取会话列表

```http
GET /api/v1/conversations
```

#### Query 参数

| 字段     | 类型    | 必填 | 约束           | 说明         |
| -------- | ------- | ---- | -------------- | ------------ |
| `userId` | string  | 是   | 1–100 个字符   | 用户 ID      |
| `appId`  | string  | 是   | 1–100 个字符   | 应用 ID      |
| `cursor` | string  | 否   | —              | 分页游标     |
| `limit`  | integer | 否   | 1–100，默认 20 | 单页返回数量 |

#### Query 示例

```http
GET /api/v1/conversations?userId=user_123&appId=app_123&limit=20
```

#### 响应参数

| 字段                    | 类型           | 说明              |
| ----------------------- | -------------- | ----------------- |
| `list[].id`             | string         | 会话 ID           |
| `list[].title`          | string         | 会话标题          |
| `list[].createdAt`      | string         | ISO 8601 创建时间 |
| `pagination.nextCursor` | string \| null | 下一页游标        |
| `pagination.hasMore`    | boolean        | 是否还有数据      |

#### 响应示例

```json
{
  "code": 200,
  "msg": "成功",
  "data": {
    "list": [
      {
        "id": "conversation_123",
        "title": "会话标题",
        "createdAt": "2026-08-12T10:00:00.000Z"
      }
    ],
    "pagination": {
      "nextCursor": null,
      "hasMore": false
    }
  }
}
```

### 2.获取单个会话（搁置）

```http
GET /api/v1/conversations/:conversationId
```

#### Path 参数

| 字段             | 类型   | 必填 | 说明    |
| ---------------- | ------ | ---- | ------- |
| `conversationId` | string | 是   | 会话 ID |

### 3.获取会话消息

```http
GET /api/v1/conversations/:conversationId/messages
```

#### Path 参数

| 字段             | 类型   | 必填 | 说明    |
| ---------------- | ------ | ---- | ------- |
| `conversationId` | string | 是   | 会话 ID |

#### Query 参数

| 字段     | 类型    | 必填 | 约束           | 说明         |
| -------- | ------- | ---- | -------------- | ------------ |
| `cursor` | string  | 否   | —              | 分页游标     |
| `limit`  | integer | 否   | 1–100，默认 50 | 单页返回数量 |

#### Query 示例

```http
GET /api/v1/conversations/conversation_123/messages?limit=50
```

#### 响应参数

| 字段                    | 类型                  | 说明              |
| ----------------------- | --------------------- | ----------------- |
| `list[].id`             | string                | 消息 ID           |
| `list[].role`           | `user` \| `assistant` | 消息角色          |
| `list[].content`        | string                | 消息内容          |
| `list[].modelId`        | string \| null        | 回复使用的模型 ID |
| `list[].createdAt`      | string                | ISO 8601 创建时间 |
| `pagination.nextCursor` | string \| null        | 下一页游标        |
| `pagination.hasMore`    | boolean               | 是否还有数据      |

#### 响应示例

```json
{
  "code": 200,
  "msg": "成功",
  "data": {
    "list": [
      {
        "id": "message_123",
        "role": "user",
        "content": "消息内容",
        "modelId": null,
        "createdAt": "2026-08-12T10:00:00.000Z"
      }
    ],
    "pagination": {
      "nextCursor": null,
      "hasMore": false
    }
  }
}
```

### 4.修改会话

```http
PATCH /api/v1/conversations/:conversationId
```

#### Path 参数

| 字段             | 类型   | 必填 | 说明    |
| ---------------- | ------ | ---- | ------- |
| `conversationId` | string | 是   | 会话 ID |

#### Body 参数

| 字段      | 类型   | 必填 | 约束         | 说明             |
| --------- | ------ | ---- | ------------ | ---------------- |
| `title`   | string | 否   | 1–100 个字符 | 会话标题         |
| `modelId` | string | 否   | 1–100 个字符 | 后续回复使用模型 |

`title` 和 `modelId` 至少传一个。

#### Body 示例

```json
{
  "title": "新的会话标题",
  "modelId": "gpt-5"
}
```

#### 响应

```json
{
  "code": 200,
  "msg": "成功",
  "data": {}
}
```

### 5.删除会话

```http
DELETE /api/v1/conversations/:conversationId
```

#### Path 参数

| 字段             | 类型   | 必填 | 说明    |
| ---------------- | ------ | ---- | ------- |
| `conversationId` | string | 是   | 会话 ID |

#### 响应

```json
{
  "code": 200,
  "msg": "成功",
  "data": {}
}
```

## 状态码

| HTTP 状态码 | 说明         |
| ----------- | ------------ |
| `200`       | 请求成功     |
| `400`       | 请求参数错误 |
| `404`       | 资源不存在   |
| `413`       | 请求体过大   |
| `500`       | 服务端错误   |
| `501`       | 接口尚未实现 |
