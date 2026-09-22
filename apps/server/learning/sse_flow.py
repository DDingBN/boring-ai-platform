import json


def encode_event(name, payload):
    data_text = json.dumps(payload, ensure_ascii=False)
    return "event: " + name + "\n" + "data: " + data_text + "\n\n"


start_event = encode_event(
    "start",
    {"requestId": "req_demo_001"},
)

done_event = encode_event(
    "done",
    {}
)

error_event = encode_event(
    "error",
    {"message": "模拟生成失败"}
)

print(start_event, end="")

texts = ["你好，"]

for text in texts:
    delta_event = encode_event(
        "delta",
        {"text": text}
    )
    print(delta_event, end="")

print(error_event, end="")