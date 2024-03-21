export declare class StocksController {
    getAllStocks(): Promise<import("typeorm").ObjectLiteral[]>;
    getOneStockById(id: number): Promise<import("typeorm").ObjectLiteral>;
    paginateStock(query: any): Promise<{
        order: any;
        sort: any;
        pageIndex: number;
        pageSize: number;
        items: import("typeorm").ObjectLiteral[];
        count: number;
    }>;
    createStock(body: any, currentUser: any): Promise<{
        success: boolean;
        errors: any[];
        data: any;
    } | {
        success: boolean;
        errors: any[];
        data: import("typeorm").ObjectLiteral;
    }>;
    updateStock(id: number, body: any, currentUser: any): Promise<{
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
    getStocksByStatus(status: any): Promise<import("typeorm").ObjectLiteral[]>;
    getFrozenStockByStockId(stockId: number): Promise<import("typeorm").ObjectLiteral>;
}
