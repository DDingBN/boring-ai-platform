from fastapi import APIRouter, Depends

from app.api.dependencies import get_chat_service
from app.schemas.api_response import ApiResponse, success_response
from app.schemas.chat import ChatRequest, ChatResponseData
from app.services.chat_service import ChatService


router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/messages", response_model=ApiResponse[ChatResponseData])
async def send_message(
    request: ChatRequest,
    service: ChatService = Depends(get_chat_service),
) -> ApiResponse[ChatResponseData]:
    response = await service.send_message(request)
    return success_response(response)
