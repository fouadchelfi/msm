import { DbService } from './db';
export declare class AppController {
    private dbSchema;
    constructor(dbSchema: DbService);
    checkAtStartup(): Promise<void>;
}
