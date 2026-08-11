import type { RequestHandler } from 'express';
import { createApiResponse } from '../utils/api-response';

export const notImplementedHandler: RequestHandler = (_req, res) => {
    res.status(501).json(
        createApiResponse(501, 'Not implemented.', {
            requestId: res.locals.requestId,
        }),
    );
};
