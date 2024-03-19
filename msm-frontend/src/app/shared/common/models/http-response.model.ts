export interface HttpResponse<DataType = any> {
    message: string;
    data: DataType;
    code: string;
    success: boolean;
}