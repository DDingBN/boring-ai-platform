from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class ChatRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    conversation_id: str | None = Field(
        default=None,
        alias="conversationId",
        min_length=1,
        max_length=100,
    )
    content: str = Field(min_length=1, max_length=2000)


class AssistantMessage(BaseModel):
    id: str
    role: Literal["assistant"] = "assistant"
    content: str
    created_at: datetime = Field(alias="createdAt")


class ChatResponseData(BaseModel):
    conversation_id: str = Field(alias="conversationId")
    message: AssistantMessage
