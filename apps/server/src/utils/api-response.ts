export interface ApiResponse<T> {
    code: number;
    msg: string;
    data: T;
}

export function createApiResponse<T>(code: number, msg: string, data: T): ApiResponse<T> {
    return { code, msg, data };
}

export function createSuccessResponse<T>(data: T, msg = '成功'): ApiResponse<T> {
    return createApiResponse(200, msg, data);
}
