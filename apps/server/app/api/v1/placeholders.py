from typing import Any

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse


router = APIRouter(tags=["planned"])


def not_implemented(request: Request) -> JSONResponse:
    return JSONResponse(
        status_code=501,
        content={
            "code": 501,
            "msg": "接口尚未实现。",
            "data": {"requestId": request.state.request_id},
        },
    )


@router.get("/models")
async def list_models(request: Request) -> JSONResponse:
    return not_implemented(request)


@router.get("/conversations")
async def list_conversations(request: Request) -> JSONResponse:
    return not_implemented(request)


@router.get("/conversations/{conversation_id}")
async def get_conversation(conversation_id: str, request: Request) -> JSONResponse:
    del conversation_id
    return not_implemented(request)


@router.get("/conversations/{conversation_id}/messages")
async def list_conversation_messages(conversation_id: str, request: Request) -> JSONResponse:
    del conversation_id
    return not_implemented(request)


@router.patch("/conversations/{conversation_id}")
async def update_conversation(
    conversation_id: str,
    request: Request,
    body: dict[str, Any] | None = None,
) -> JSONResponse:
    del conversation_id, body
    return not_implemented(request)


@router.delete("/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str, request: Request) -> JSONResponse:
    del conversation_id
    return not_implemented(request)
