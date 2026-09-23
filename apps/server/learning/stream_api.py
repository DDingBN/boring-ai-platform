import json

from fastapi import FastAPI
from fastapi.responses import StreamingResponse

from learning.mock_stream import mock_parts

app = FastAPI()


def encode_event(name, payload):
    data_text = json.dumps(payload, ensure_ascii=False)
    return "event: " + name + "\n" + "data: " + data_text + "\n\n"


async def generate_events():
    yield encode_event("start", {"requestId": "req_demo_001"})

    try:
        async for part in mock_parts():
            yield encode_event("delta", {"text": part})
    except ValueError as error:
        yield encode_event("error", {"message": str(error)})
        return

    yield encode_event("done", {})


@app.get("/stream")
async def stream():
    return StreamingResponse(
        generate_events(),
        media_type="text/event-stream",
        headers={"x-request-id": "req_demo_001"},
    )
