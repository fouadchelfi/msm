export declare class DbService {
    constructor();
    checkDb(): Promise<void>;
    checkTables(): Promise<void>;
    checkAdminUser(): Promise<void>;
}
