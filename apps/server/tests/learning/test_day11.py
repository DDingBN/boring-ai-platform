from fastapi.testclient import TestClient

from app.main import create_app


def test_health():
    app = create_app()

    with TestClient(app) as client:
        response = client.get("/health")

        assert response.status_code == 200
        assert response.json() == {
            "code": 200,
            "msg": "成功",
            "data": {"ok": True},
        }


def test_missing_route():
    app = create_app()

    with TestClient(app) as client:
        response = client.get("/missing")

        body = response.json()

        assert response.status_code == 404
        assert body["code"] == 404
        assert body["msg"] == "请求的接口不存在。"
        assert body["data"]["requestId"] == response.headers["x-request-id"]
