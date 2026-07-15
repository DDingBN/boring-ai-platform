import express from 'express';
import { errorMiddleware } from './middleware/error.middleware';
import { requestIdMiddleware } from './middleware/request-id.middleware';

const JSON_BODY_LIMIT = '1mb';

export function createApp(): express.Express {
    const app = express();

    app.use(requestIdMiddleware);
    app.use(express.json({ limit: JSON_BODY_LIMIT }));

    // 存活检查只表示当前进程能够响应 HTTP 请求。
    app.get('/health', (_req, res) => {
        res.json({ ok: true });
    });

    app.use((_req, _res, next) => {
        const error = new Error('Route not found.') as Error & { status: number };
        error.status = 404;
        next(error);
    });

    // 错误中间件必须最后注册，以便同时处理请求体解析错误。
    app.use(errorMiddleware);

    return app;
}
