import { ManagerService } from 'src/services';
export declare class EmployeePaymentsController {
    private manager;
    constructor(manager: ManagerService);
    getAllPayments(): Promise<import("typeorm").ObjectLiteral[]>;
    getOnePaymentById(id: number): Promise<import("typeorm").ObjectLiteral>;
    paginatePayment(query: any): Promise<{
        order: any;
        sort: any;
        pageIndex: number;
        pageSize: number;
        items: import("typeorm").ObjectLiteral[];
        count: number;
    }>;
    createPayment(body: any, currentUser: any): Promise<{
        success: boolean;
        errors: any[];
        data: any;
    } | {
        success: boolean;
        errors: any[];
        data: import("typeorm").ObjectLiteral;
    }>;
    updatePayment(id: number, body: any, currentUser: any): Promise<{
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
