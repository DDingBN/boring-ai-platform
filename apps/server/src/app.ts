import express from 'express';
import { errorMiddleware } from './middleware/error.middleware';
import { requestIdMiddleware } from './middleware/request-id.middleware';
import { chatRouter } from './chat/chat.router';
import { conversationRouter } from './conversation/conversation.router';
import { modelRouter } from './model/model.router';
import { createSuccessResponse } from './utils/api-response';

const JSON_BODY_LIMIT = '1mb';

export function createApp(): express.Express {
    const app = express();

    app.use(requestIdMiddleware);
    app.use(express.json({ limit: JSON_BODY_LIMIT }));

    // 存活检查只表示当前进程能够响应 HTTP 请求。
    app.get('/health', (_req, res) => {
        res.json(createSuccessResponse({ ok: true }));
    });

    app.use('/api/v1/models', modelRouter);
    app.use('/api/v1/chat', chatRouter);
    app.use('/api/v1/conversations', conversationRouter);

    app.use((_req, _res, next) => {
        const error = new Error('请求的接口不存在。') as Error & { status: number };
        error.status = 404;
        next(error);
    });

    // 错误中间件必须最后注册，以便同时处理请求体解析错误。
    app.use(errorMiddleware);

    return app;
}
