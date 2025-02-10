enum ErrorType{
    ERROR,
    WARNING
}

interface SuccessResponse<T> {
    message: string;
    isSuccess: true;
    data: T;
}

interface ErrorResponse {
    message: string;
    isSuccess: false;
    errorType: ErrorType;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export {
    ErrorType
}

export type {
    ApiResponse
}