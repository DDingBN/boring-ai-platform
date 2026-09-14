from fastapi.testclient import TestClient

from app.api.dependencies import get_chat_service
from app.llm.mock import MockChatProvider
from app.main import create_app
from app.services.chat_service import ChatService


app = create_app()
app.dependency_overrides[get_chat_service] = lambda: ChatService(MockChatProvider())
client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"code": 200, "msg": "成功", "data": {"ok": True}}
    assert response.headers["x-request-id"].startswith("req_")


def test_chat_uses_mock_provider() -> None:
    response = client.post("/api/v1/chat/messages", json={"content": "你好"})
    body = response.json()
    assert response.status_code == 200
    assert body["data"]["message"]["content"] == "Python 服务端已收到：你好"
    assert body["data"]["message"]["role"] == "assistant"


def test_chat_rejects_invalid_body() -> None:
    response = client.post("/api/v1/chat/messages", json={"content": "   ", "extra": True})
    assert response.status_code == 400
    assert response.json()["msg"] == "请求参数无效。"


def test_unknown_route_returns_uniform_error() -> None:
    response = client.get("/missing")
    assert response.status_code == 404
    assert response.json()["msg"] == "请求的接口不存在。"
