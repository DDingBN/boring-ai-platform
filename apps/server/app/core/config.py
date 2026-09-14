from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


PROJECT_ROOT = Path(__file__).resolve().parents[4]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=PROJECT_ROOT / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    node_env: Literal["development", "test", "production"] = "development"
    server_host: str = "127.0.0.1"
    server_port: int = Field(default=3001, ge=1, le=65535)
    ai_provider: Literal["mock", "deepseek"] = "mock"
    deepseek_api_key: str | None = None
    deepseek_model: str = "deepseek-chat"

    @field_validator("server_host", "deepseek_model")
    @classmethod
    def validate_non_blank(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized or any(character.isspace() for character in normalized):
            raise ValueError("配置值不能为空或包含空白字符")
        return normalized

    @field_validator("deepseek_api_key")
    @classmethod
    def normalize_optional_secret(cls, value: str | None) -> str | None:
        if value is None or value == "":
            return None
        if any(character.isspace() for character in value):
            raise ValueError("DEEPSEEK_API_KEY 不能包含空白字符")
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()
