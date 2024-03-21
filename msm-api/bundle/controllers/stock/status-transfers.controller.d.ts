import { ManagerService } from 'src/services';
export declare class StatusTransfersController {
    private manager;
    constructor(manager: ManagerService);
    getAllStatusTransfers(): Promise<import("typeorm").ObjectLiteral[]>;
    getOneStatusTransferById(id: number): Promise<import("typeorm").ObjectLiteral>;
    paginateStatusTransfer(query: any): Promise<{
        order: any;
        sort: any;
        pageIndex: number;
        pageSize: number;
        items: import("typeorm").ObjectLiteral[];
        count: number;
    }>;
    createStatusTransfer(body: any, currentUser: any): Promise<{
        success: boolean;
        errors: any[];
        data: any;
    } | {
        success: boolean;
        errors: any[];
        data: import("typeorm").ObjectLiteral;
    }>;
    updateStatusTransfer(id: number, body: any, currentUser: any): Promise<{
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
