export declare class FencesController {
    getAllFences(): Promise<import("typeorm").ObjectLiteral[]>;
    getOneFenceById(id: number): Promise<import("typeorm").ObjectLiteral>;
    paginateFence(query: any): Promise<{
        order: any;
        sort: any;
        pageIndex: number;
        pageSize: number;
        items: import("typeorm").ObjectLiteral[];
        count: number;
    }>;
    createFence(body: any, currentUser: any): Promise<{
        success: boolean;
        errors: any[];
        data: any;
    } | {
        success: boolean;
        errors: any[];
        data: import("typeorm").ObjectLiteral;
    }>;
    updateFence(id: number, body: any, currentUser: any): Promise<{
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
    getPurchasesTotalCost(categoryId: number): Promise<any>;
    getCustomersSalesTotalAmount(categoryId: number): Promise<any>;
    getDistrgetPremisesSalesTotalAmountibutionsTotalAmount(categoryId: number): Promise<{
        total: number;
    }>;
    getBatchesTotalAmount(categoryId: number): Promise<{
        totalItems: any;
        totalIngredients: any;
    }>;
    getStocksTotalQuantity(categoryId: number): Promise<any>;
    getStocksTotalAmount(categoryId: number): Promise<any>;
    getChargesTotalAmount(): Promise<any>;
    getLossesTotalAmount(): Promise<any>;
    getEmployeesTotalPayments(): Promise<any>;
    getEmployeesTotalDebts(): Promise<any>;
    getSuppliersTotalDebts(): Promise<any>;
    getCustomersTotalDebts(): Promise<any>;
}
