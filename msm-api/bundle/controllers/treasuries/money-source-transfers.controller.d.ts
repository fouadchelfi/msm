import { ManagerService } from 'src/services';
export declare class MoneySourceTransfersController {
    private manager;
    constructor(manager: ManagerService);
    getAllTransfers(): Promise<import("typeorm").ObjectLiteral[]>;
    getOneTransferById(id: number): Promise<import("typeorm").ObjectLiteral>;
    paginateTransfer(query: any): Promise<{
        order: any;
        sort: any;
        pageIndex: number;
        pageSize: number;
        items: import("typeorm").ObjectLiteral[];
        count: number;
    }>;
    createTransfer(body: any, currentUser: any): Promise<{
        success: boolean;
        errors: any[];
        data: any;
    } | {
        success: boolean;
        errors: any[];
        data: import("typeorm").ObjectLiteral;
    }>;
    updateTransfer(id: number, body: any, currentUser: any): Promise<{
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
}
