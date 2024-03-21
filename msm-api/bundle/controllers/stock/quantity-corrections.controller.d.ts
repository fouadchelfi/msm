import { ManagerService } from 'src/services';
export declare class QuantityCorrectionsController {
    private manager;
    constructor(manager: ManagerService);
    getAllQuantityCorrections(): Promise<import("typeorm").ObjectLiteral[]>;
    getOneQuantityCorrectionById(id: number): Promise<import("typeorm").ObjectLiteral>;
    paginateQuantityCorrection(query: any): Promise<{
        order: any;
        sort: any;
        pageIndex: number;
        pageSize: number;
        items: import("typeorm").ObjectLiteral[];
        count: number;
    }>;
    createQuantityCorrection(body: any, currentUser: any): Promise<{
        success: boolean;
        errors: any[];
        data: any;
    } | {
        success: boolean;
        errors: any[];
        data: import("typeorm").ObjectLiteral;
    }>;
    updateQuantityCorrection(id: number, body: any, currentUser: any): Promise<{
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
