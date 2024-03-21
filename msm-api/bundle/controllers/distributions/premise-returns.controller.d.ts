import { ManagerService } from 'src/services';
export declare class PremiseReturnsController {
    private manager;
    constructor(manager: ManagerService);
    getAllPremiseReturns(): Promise<import("typeorm").ObjectLiteral[]>;
    getOnePremiseReturnById(id: number): Promise<import("typeorm").ObjectLiteral>;
    paginatePremiseReturn(query: any): Promise<{
        order: any;
        sort: any;
        pageIndex: number;
        pageSize: number;
        items: import("typeorm").ObjectLiteral[];
        count: number;
    }>;
    createPremiseReturn(body: any, currentUser: any): Promise<{
        success: boolean;
        errors: any[];
        data: any;
    } | {
        success: boolean;
        errors: any[];
        data: import("typeorm").ObjectLiteral;
    }>;
    updatePremiseReturn(id: number, body: any, currentUser: any): Promise<{
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
    getItemsByPremiseReturnId(premiseReturnId: number): Promise<import("typeorm").ObjectLiteral[]>;
}
