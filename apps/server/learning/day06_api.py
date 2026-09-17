from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

@app.get("/hello")
def hello():
    return {"message": "我正在学习 D06"}

class EchoRequest(BaseModel):
    content: str


@app.post("/echo")
def echo(body: EchoRequest):
    return {
        "message": body.content,
        "source": "练习接口"
    }