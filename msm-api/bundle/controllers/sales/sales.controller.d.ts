import { ManagerService } from 'src/services';
export declare class SalesController {
    private manager;
    constructor(manager: ManagerService);
    getAllSales(): Promise<import("typeorm").ObjectLiteral[]>;
    getOneSaleById(id: number): Promise<import("typeorm").ObjectLiteral>;
    paginateSale(query: any): Promise<{
        order: any;
        sort: any;
        pageIndex: number;
        pageSize: number;
        items: import("typeorm").ObjectLiteral[];
        count: number;
    }>;
    createSale(body: any, currentUser: any): Promise<{
        success: boolean;
        errors: any[];
        data: any;
    } | {
        success: boolean;
        errors: any[];
        data: import("typeorm").ObjectLiteral;
    }>;
    updateSale(id: number, body: any, currentUser: any): Promise<{
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
    getItemsBySaleId(saleId: number): Promise<import("typeorm").ObjectLiteral[]>;
}
