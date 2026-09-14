class ApplicationError(Exception):
    def __init__(self, message: str, *, code: str, status_code: int) -> None:
        super().__init__(message)
        self.code = code
        self.status_code = status_code


class ProviderConfigurationError(ApplicationError):
    def __init__(self, message: str) -> None:
        super().__init__(message, code="PROVIDER_NOT_CONFIGURED", status_code=503)


class ProviderRequestError(ApplicationError):
    def __init__(self, message: str = "模型服务暂时不可用。") -> None:
        super().__init__(message, code="PROVIDER_REQUEST_FAILED", status_code=502)
