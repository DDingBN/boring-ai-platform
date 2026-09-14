import re
from uuid import uuid4

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.v1.chat import router as chat_router
from app.api.v1.placeholders import router as placeholder_router
from app.core.errors import ApplicationError
from app.schemas.api_response import success_response


REQUEST_ID_PATTERN = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$")
MAX_BODY_SIZE = 1024 * 1024


def error_response(request: Request, status_code: int, message: str, error_code: str | None = None):
    data: dict[str, str] = {"requestId": request.state.request_id}
    if error_code:
        data["errorCode"] = error_code
    return JSONResponse(
        status_code=status_code,
        content={"code": status_code, "msg": message, "data": data},
    )


def create_app() -> FastAPI:
    application = FastAPI(title="Boring AI Platform API", version="0.1.0")

    @application.middleware("http")
    async def request_context(request: Request, call_next):
        incoming_request_id = request.headers.get("x-request-id", "").strip()
        request_id = (
            incoming_request_id
            if REQUEST_ID_PATTERN.fullmatch(incoming_request_id)
            else f"req_{uuid4()}"
        )
        request.state.request_id = request_id

        content_length = request.headers.get("content-length")
        if content_length and content_length.isdigit() and int(content_length) > MAX_BODY_SIZE:
            response = error_response(request, 413, "请求体过大。")
        else:
            response = await call_next(request)

        response.headers["x-request-id"] = request_id
        return response

    @application.exception_handler(RequestValidationError)
    async def validation_error_handler(request: Request, error: RequestValidationError):
        del error
        return error_response(request, 400, "请求参数无效。")

    @application.exception_handler(StarletteHTTPException)
    async def http_error_handler(request: Request, error: StarletteHTTPException):
        if error.status_code == 404:
            return error_response(request, 404, "请求的接口不存在。")
        if 400 <= error.status_code < 500:
            return error_response(request, error.status_code, "请求参数无效。")
        return error_response(request, 500, "服务器内部错误。")

    @application.exception_handler(ApplicationError)
    async def application_error_handler(request: Request, error: ApplicationError):
        return error_response(request, error.status_code, str(error), error.code)

    @application.exception_handler(Exception)
    async def unexpected_error_handler(request: Request, error: Exception):
        print(f"Unhandled server error: {error!r}")
        return error_response(request, 500, "服务器内部错误。")

    @application.get("/health")
    async def health():
        return success_response({"ok": True})

    application.include_router(chat_router, prefix="/api/v1")
    application.include_router(placeholder_router, prefix="/api/v1")
    return application


app = create_app()
