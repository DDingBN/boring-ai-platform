from functools import lru_cache

from app.core.config import get_settings
from app.core.errors import ProviderConfigurationError
from app.llm.base import ChatProvider
from app.llm.deepseek import DeepSeekChatProvider
from app.llm.mock import MockChatProvider


@lru_cache
def get_chat_provider() -> ChatProvider:
    settings = get_settings()

    if settings.ai_provider == "mock":
        return MockChatProvider()

    if not settings.deepseek_api_key:
        raise ProviderConfigurationError("使用 DeepSeek 前请配置 DEEPSEEK_API_KEY。")

    return DeepSeekChatProvider(
        api_key=settings.deepseek_api_key,
        model=settings.deepseek_model,
    )
