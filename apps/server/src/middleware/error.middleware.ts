import type { ErrorRequestHandler } from 'express';

interface HttpError extends Error {
    status?: number;
    statusCode?: number;
}

function readStatus(error: HttpError): number {
    const status = error.status ?? error.statusCode;

    // 不允许任意异常值直接控制对外响应状态码。
    return typeof status === 'number' && status >= 400 && status < 500 ? status : 500;
}

function publicError(status: number): { code: string; message: string } {
    if (status === 404) {
        return { code: 'NOT_FOUND', message: 'Route not found.' };
    }

    if (status === 413) {
        return { code: 'INVALID_REQUEST', message: 'Request body is too large.' };
    }

    if (status >= 400 && status < 500) {
        return { code: 'INVALID_REQUEST', message: 'Invalid request.' };
    }

    return { code: 'INTERNAL_ERROR', message: 'Internal server error.' };
}

export const errorMiddleware: ErrorRequestHandler = (error: HttpError, _req, res, _next) => {
    // Express 通过四参数函数签名识别错误处理中间件。
    void _next;

    const status = readStatus(error);
    const publicDetails = publicError(status);

    // 诊断信息只保留在服务端，禁止序列化 Error 对象或堆栈。
    if (status === 500) {
        console.error(error);
    }

    res.status(status).json({
        error: {
            ...publicDetails,
            requestId: res.locals.requestId,
        },
    });
};
