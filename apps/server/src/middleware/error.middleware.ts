import type { ErrorRequestHandler } from 'express';
import { createApiResponse } from '../utils/api-response';

interface HttpError extends Error {
    status?: number;
    statusCode?: number;
}

function readStatus(error: HttpError): number {
    const status = error.status ?? error.statusCode;

    // 不允许任意异常值直接控制对外响应状态码。
    return typeof status === 'number' && status >= 400 && status < 500 ? status : 500;
}

function publicMessage(status: number): string {
    if (status === 404) {
        return '请求的接口不存在。';
    }

    if (status === 413) {
        return '请求体过大。';
    }

    if (status >= 400 && status < 500) {
        return '请求参数无效。';
    }

    return '服务器内部错误。';
}

export const errorMiddleware: ErrorRequestHandler = (error: HttpError, _req, res, _next) => {
    // Express 通过四参数函数签名识别错误处理中间件。
    void _next;

    const status = readStatus(error);
    const msg = publicMessage(status);

    // 诊断信息只保留在服务端，禁止序列化 Error 对象或堆栈。
    if (status === 500) {
        console.error(error);
    }

    res.status(status).json(
        createApiResponse(status, msg, {
            requestId: res.locals.requestId,
        }),
    );
};
