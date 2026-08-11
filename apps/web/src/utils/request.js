import axios from 'axios';

const SUCCESS_CODE = 200;

export class ApiError extends Error {
    constructor(message, options = {}) {
        super(message, { cause: options.cause });
        this.name = 'ApiError';
        this.code = options.code;
        this.data = options.data;
        this.status = options.status;
    }
}

function isApiResponse(value) {
    return (
        value !== null &&
        typeof value === 'object' &&
        Object.hasOwn(value, 'code') &&
        Object.hasOwn(value, 'msg') &&
        Object.hasOwn(value, 'data')
    );
}

function unwrapResponse(response) {
    const body = response.data;

    if (!isApiResponse(body)) {
        throw new ApiError('服务端响应格式不正确。', {
            code: 'INVALID_RESPONSE',
            data: body,
            status: response.status,
        });
    }

    if (body.code !== SUCCESS_CODE) {
        throw new ApiError(body.msg || '请求失败。', {
            code: body.code,
            data: body.data,
            status: response.status,
        });
    }

    return body.data;
}

const request = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
    },
    timeout: 10_000,
});

request.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token && !config.headers.has('Authorization')) {
            config.headers.set('Authorization', `Bearer ${token}`);
        }

        return config;
    },
    (error) => Promise.reject(error),
);

request.interceptors.response.use(
    (response) => unwrapResponse(response),
    (error) => {
        const response = error.response;

        if (response && isApiResponse(response.data)) {
            return Promise.reject(
                new ApiError(response.data.msg || '请求失败。', {
                    cause: error,
                    code: response.data.code,
                    data: response.data.data,
                    status: response.status,
                }),
            );
        }

        return Promise.reject(error);
    },
);

export function axiosPost(url, data = {}, config = {}) {
    return request.post(url, data, config);
}

export default request;
