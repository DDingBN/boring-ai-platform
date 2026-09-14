from typing import Generic, TypeVar

from pydantic import BaseModel


DataT = TypeVar("DataT")


class ApiResponse(BaseModel, Generic[DataT]):
    code: int
    msg: str
    data: DataT


class ErrorData(BaseModel):
    requestId: str
    errorCode: str | None = None


def success_response(data: DataT, message: str = "成功") -> ApiResponse[DataT]:
    return ApiResponse(code=200, msg=message, data=data)
