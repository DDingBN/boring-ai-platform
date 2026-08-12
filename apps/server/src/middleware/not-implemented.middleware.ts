import type { RequestHandler } from 'express';
import { createApiResponse } from '../utils/api-response';

export const notImplementedHandler: RequestHandler = (_req, res) => {
    res.status(501).json(
        createApiResponse(501, '接口尚未实现。', {
            requestId: res.locals.requestId,
        }),
    );
};
