type OperationResult<T> = {
    isSuccess: boolean;
    value?: T;
    error?: string;
}
