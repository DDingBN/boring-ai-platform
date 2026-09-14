from datetime import UTC, datetime
from uuid import uuid4

from app.llm.base import ChatProvider
from app.schemas.chat import AssistantMessage, ChatRequest, ChatResponseData


class ChatService:
    def __init__(self, provider: ChatProvider) -> None:
        self._provider = provider

    async def send_message(self, request: ChatRequest) -> ChatResponseData:
        content = await self._provider.complete(request.content)
        return ChatResponseData(
            conversationId=request.conversation_id or str(uuid4()),
            message=AssistantMessage(
                id=str(uuid4()),
                content=content,
                createdAt=datetime.now(UTC),
            ),
        )
