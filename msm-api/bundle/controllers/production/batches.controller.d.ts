import { ManagerService } from 'src/services';
export declare class BatchesController {
    private manager;
    constructor(manager: ManagerService);
    getAllBatches(): Promise<import("typeorm").ObjectLiteral[]>;
    getOneBatchById(id: number): Promise<import("typeorm").ObjectLiteral>;
    paginateBatch(query: any): Promise<{
        order: any;
        sort: any;
        pageIndex: number;
        pageSize: number;
        items: import("typeorm").ObjectLiteral[];
        count: number;
    }>;
    createBatch(body: any, currentUser: any): Promise<{
        success: boolean;
        errors: any[];
        data: any;
    } | {
        success: boolean;
        errors: any[];
        data: import("typeorm").ObjectLiteral;
    }>;
    updateBatch(id: number, body: any, currentUser: any): Promise<{
        success: boolean;
        errors: any[];
        data: any;
    } | {
        success: boolean;
        errors: any[];
        data: import("typeorm").ObjectLiteral;
    }>;
    deleteMany(query: any): Promise<{
        success: boolean;
    }>;
    getItemById(id: number): Promise<import("typeorm").ObjectLiteral>;
    getIngredientById(id: number): Promise<import("typeorm").ObjectLiteral>;
    getItemsByBatchId(batchId: number): Promise<import("typeorm").ObjectLiteral[]>;
    getIngredientsByBatchId(batchId: number): Promise<import("typeorm").ObjectLiteral[]>;
}
