import asyncio
import json

from fastapi import FastAPI
from fastapi.responses import StreamingResponse


app = FastAPI()


def encode_event(name, payload):
    data_text = json.dumps(payload, ensure_ascii=False)
    return "event: " + name + "\n" + "data: " + data_text + "\n\n"


full_text = ["你好，", "我是 Mock。"]


async def generate_events():
    yield encode_event("start", {"requestId": "req_demo_001"})
    await asyncio.sleep(1)
    for text in full_text:
        yield encode_event("delta", {"text": text})
        await asyncio.sleep(1)
    yield encode_event("done", {})


@app.get("/stream")
async def stream():
    return StreamingResponse(
        generate_events(),
        media_type="text/event-stream",
        headers={"x-request-id": "req_demo_001"},
    )
