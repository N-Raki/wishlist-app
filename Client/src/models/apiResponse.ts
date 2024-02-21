export type ApiResponse<T> = {
    data: T | null;
    isLoading: boolean;
    error: string | null;
}