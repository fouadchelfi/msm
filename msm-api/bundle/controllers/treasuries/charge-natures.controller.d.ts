export declare class ChargeNaturesController {
    getAllChargeNatures(): Promise<import("typeorm").ObjectLiteral[]>;
    getOneCategoyById(id: number): Promise<import("typeorm").ObjectLiteral>;
    paginateChargeNature(query: any): Promise<{
        order: any;
        sort: any;
        pageIndex: number;
        pageSize: number;
        items: import("typeorm").ObjectLiteral[];
        count: number;
    }>;
    createChargeNature(body: any, currentUser: any): Promise<{
        success: boolean;
        errors: any[];
        data: any;
    } | {
        success: boolean;
        errors: any[];
        data: import("typeorm").ObjectLiteral;
    }>;
    updateChargeNature(id: number, body: any, currentUser: any): Promise<{
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
