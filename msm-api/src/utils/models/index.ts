export interface ValidationResponse {
    success: boolean;
    messages: { property: string, message: string }[];
}
