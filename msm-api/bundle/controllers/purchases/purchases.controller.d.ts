import { ManagerService } from 'src/services';
export declare class PurchasesController {
    private manager;
    constructor(manager: ManagerService);
    getAllPurchases(): Promise<import("typeorm").ObjectLiteral[]>;
    getOnePurchaseById(id: number): Promise<import("typeorm").ObjectLiteral>;
    paginatePurchase(query: any): Promise<{
        order: any;
        sort: any;
        pageIndex: number;
        pageSize: number;
        items: import("typeorm").ObjectLiteral[];
        count: number;
    }>;
    createPurchase(body: any, currentUser: any): Promise<{
        success: boolean;
        errors: any[];
        data: any;
    } | {
        success: boolean;
        errors: any[];
        data: import("typeorm").ObjectLiteral;
    }>;
    updatePurchase(id: number, body: any, currentUser: any): Promise<{
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
    getItemsByPurchaseId(purchaseId: number): Promise<import("typeorm").ObjectLiteral[]>;
}
