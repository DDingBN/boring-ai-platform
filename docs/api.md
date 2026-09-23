# API 接口文档

本页维护接口契约。接口总览标为“待实现”的 Model、Conversation 接口目前均返回 `501`；
下文对应的参数与成功响应是目标设计，不代表已有实现。整体进度见
[项目进度](project-status.md)。

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

错误响应的 `data.requestId` 用于关联请求。Provider 应用错误还包含可选的 `data.errorCode`：

- HTTP `502`：`PROVIDER_REQUEST_FAILED`，模型调用失败。
- HTTP `503`：`PROVIDER_NOT_CONFIGURED`，选择 DeepSeek 但未配置 API Key。

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

## SSE 事件约定（M04 学习设计，待实现）

以下是独立练习确认的最小事件约定。`apps/server/learning/stream_api.py` 已提供独立的
`GET /stream` 练习接口（默认端口 `3002`）；项目业务 API 尚无流式接口或前端解析实现，
不代表聊天功能已支持 SSE。业务接口路径与 HTTP 接入细节将在 M05 后续单元确定。
现有普通 JSON 接口及 `{ code, msg, data }` 保持兼容；
未来 SSE 响应使用 `text/event-stream`，不套用普通 JSON 响应解包器。

| 事件名 | data 的 JSON 示例 | 含义 |
| ------ | ----------------- | ---- |
| `start` | `{"requestId":"req_demo_001"}` | 开始本次回复 |
| `delta` | `{"text":"你好"}` | 可立即追加显示的文字片段 |
| `done` | `{}` | 成功完成 |
| `error` | `{"message":"模拟生成失败"}` | 失败结束 |

`requestId` 标识本次请求，不是会话 ID。练习使用固定值；接入 HTTP 时应与该请求的
`x-request-id` 一致。同一响应流内后续事件关联其 `start` 中的请求 ID。

正常序列为 `start → delta → delta → done`；中途失败示例为 `start → delta → error`。
`start` 只出现一次，`delta` 可以出现零次或多次。受控执行以 `done` 或 `error` 之一结束，
终止后不再发送本次回复的事件。断线可能导致终止事件未送达，不能把连接结束视为成功。

| 当前状态 | 事件 | 下一状态或处理 |
| -------- | ---- | -------------- |
| 未开始 | `start` | 进行中 |
| 进行中 | `delta` | 追加文字，保持进行中 |
| 进行中 | `done` | 已成功结束 |
| 进行中 | `error` | 已失败结束 |
| 已成功结束或已失败结束 | 任意后续事件 | 违反约定，不改变终态 |

其他未列出的转换也不合法，例如未开始就收到 `delta`、进行中再次收到 `start`。

每条练习事件按 `event: 名称\ndata: JSON文本\n\n` 编码。最后的空行结束当前事件，
`done`/`error` 则结束整个回复流程，两者不可混淆。完整 `delta` 可以立即显示，
不必等 `done`，但只有 `done` 才表示整个回复成功。
一次网络读取可能仅包含半条事件，也可能包含多条事件，接收端必须按事件边界组装。
JSON 编码及固定正常、失败序列已通过独立 HTTP 练习接口验证；网络分片、真实异常映射和浏览器处理仍待实现验证。

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

| 字段             | 类型   | 必填 | 约束          | 说明                    |
| ---------------- | ------ | ---- | ------------- | ----------------------- |
| `conversationId` | string | 否   | 1–100 个字符  | 会话 ID；首次发送时不传 |
| `content`        | string | 是   | 1–2000 个字符 | 用户输入内容            |

#### Body 示例

首次发送：

```json
{
  "content": "你好"
}
```

续传会话 ID：

```json
{
  "conversationId": "conversation_123",
  "content": "继续刚才的话题"
}
```

当前服务端仅生成或回传 `conversationId`，不会持久化消息或按该 ID 加载历史。
每次只将本次 `content` 传给模型，因此续传 ID 尚不提供多轮上下文记忆。

#### 响应参数

| 字段                | 类型   | 说明              |
| ------------------- | ------ | ----------------- |
| `conversationId`    | string | 会话 ID           |
| `message.id`        | string | 消息 ID           |
| `message.role`      | string | 消息角色          |
| `message.content`   | string | 消息内容          |
| `message.createdAt` | string | ISO 8601 创建时间 |

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
| `502`       | 模型调用失败 |
| `503`       | 模型配置缺失 |
