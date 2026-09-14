from functools import lru_cache

from app.llm.factory import get_chat_provider
from app.services.chat_service import ChatService


@lru_cache
def get_chat_service() -> ChatService:
    return ChatService(get_chat_provider())
