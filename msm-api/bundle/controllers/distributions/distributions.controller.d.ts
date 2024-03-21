import { ManagerService } from 'src/services';
export declare class DistributionsController {
    private manager;
    constructor(manager: ManagerService);
    getAllDistributions(): Promise<import("typeorm").ObjectLiteral[]>;
    getOneDistributionById(id: number): Promise<import("typeorm").ObjectLiteral>;
    paginateDistribution(query: any): Promise<{
        order: any;
        sort: any;
        pageIndex: number;
        pageSize: number;
        items: import("typeorm").ObjectLiteral[];
        count: number;
    }>;
    createDistribution(body: any, currentUser: any): Promise<{
        success: boolean;
        errors: any[];
        data: any;
    } | {
        success: boolean;
        errors: any[];
        data: import("typeorm").ObjectLiteral;
    }>;
    updateDistribution(id: number, body: any, currentUser: any): Promise<{
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
    getItemsByDistributionId(distributionId: number): Promise<import("typeorm").ObjectLiteral[]>;
}
