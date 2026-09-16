def make_reply(content):
    value = content.strip()
    if(value == ""):
        raise ValueError("输入不能为空")

    return "woc" + content