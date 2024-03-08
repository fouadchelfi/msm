import { Injectable } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';

@Injectable()
export class DbService {
    constructor() { }

    checkSchema() {
        this.createTables();
    }

    async createTables() {
        await AppDataSource.manager.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY NOT NULL,
                name VARCHAR(50),
                password VARCHAR(20),
                code VARCHAR(16),
                notes VARCHAR(300),
                "createdAt" TIMESTAMP,
                "createdBy" INT,
                "lastUpdateAt" TIMESTAMP,
                "lastUpdateBy" INT
            );
            ALTER TABLE users ADD CONSTRAINT createBy_fk FOREIGN KEY ("createdBy") REFERENCES users(id);
            ALTER TABLE users ADD CONSTRAINT lastUpdateBy_fk FOREIGN KEY ("lastUpdateBy") REFERENCES users(id);
        `);

        await AppDataSource.manager.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY NOT NULL,
                label VARCHAR(100),
                code VARCHAR(16),
                notes VARCHAR(300),
                "createdAt" TIMESTAMP, 
                "createdBy" INT,
                "lastUpdateAt" TIMESTAMP,
                "lastUpdateBy" INT
            );
            ALTER TABLE categories ADD CONSTRAINT createBy_fk FOREIGN KEY ("createdBy") REFERENCES users(id);
            ALTER TABLE categories ADD CONSTRAINT lastUpdateBy_fk FOREIGN KEY ("lastUpdateBy") REFERENCES users(id);
        `);

    }
}