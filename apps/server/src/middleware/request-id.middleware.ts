import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';

const REQUEST_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

export const requestIdMiddleware: RequestHandler = (req, res, next) => {
    const incomingRequestId = req.get('x-request-id')?.trim();

    // 仅回传长度和格式均安全的调用方请求标识。
    const requestId =
        incomingRequestId && REQUEST_ID_PATTERN.test(incomingRequestId)
            ? incomingRequestId
            : `req_${randomUUID()}`;

    res.locals.requestId = requestId;
    res.setHeader('x-request-id', requestId);
    next();
};
