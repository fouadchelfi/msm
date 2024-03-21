export declare class UsersController {
    getAllUsers(): Promise<import("typeorm").ObjectLiteral[]>;
    getOneUserById(id: number): Promise<import("typeorm").ObjectLiteral>;
    paginateUser(query: any): Promise<{
        order: any;
        sort: any;
        pageIndex: any;
        pageSize: any;
        items: import("typeorm").ObjectLiteral[];
        count: number;
    }>;
    createUser(body: any, currentUser: any): Promise<{
        success: boolean;
        messages: any[];
        data: any;
        errors?: undefined;
    } | {
        success: boolean;
        errors: any[];
        data: import("typeorm").ObjectLiteral;
        messages?: undefined;
    }>;
    updateUser(id: number, body: any, currentUser: any): Promise<{
        success: boolean;
        messages: any[];
        data: any;
        errors?: undefined;
    } | {
        success: boolean;
        errors: any[];
        data: import("typeorm").ObjectLiteral;
        messages?: undefined;
    }>;
    chargePassword(id: number, body: any, currentUser: any): Promise<{
        success: boolean;
        errors: string[];
        data?: undefined;
    } | {
        success: boolean;
        errors: any[];
        data: import("typeorm").ObjectLiteral;
    }>;
    deleteMany(query: any): Promise<{
        success: boolean;
    }>;
}
