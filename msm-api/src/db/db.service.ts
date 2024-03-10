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
                code VARCHAR(16),
                name VARCHAR(50),
                password VARCHAR(20),
                notes VARCHAR(300),
                "createdAt" TIMESTAMP,
                "createdBy" INT,
                "lastUpdateAt" TIMESTAMP,
                "lastUpdateBy" INT,
                CONSTRAINT fk_created_by FOREIGN KEY("createdBy") REFERENCES users(id),
                CONSTRAINT fk_last_updated_by FOREIGN KEY("lastUpdateBy") REFERENCES users(id)
            );
        `);

        await AppDataSource.manager.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY NOT NULL,
                code VARCHAR(16),
                label VARCHAR(100),
                notes VARCHAR(300),
                "createdAt" TIMESTAMP, 
                "createdBy" INT,
                "lastUpdateAt" TIMESTAMP,
                "lastUpdateBy" INT,
                CONSTRAINT fk_created_by FOREIGN KEY("createdBy") REFERENCES users(id),
                CONSTRAINT fk_last_updated_by FOREIGN KEY("lastUpdateBy") REFERENCES users(id)
            );
        `);

        await AppDataSource.manager.query(`
            CREATE TABLE IF NOT EXISTS suppliers (
                id SERIAL PRIMARY KEY NOT NULL,
                code VARCHAR(16),
                name VARCHAR(100),
                debt NUMERIC(10, 2),
                address VARCHAR(200),
                "postalCode" VARCHAR(30),
                province VARCHAR(30),
                city VARCHAR(30),
                "phoneNumberOne" VARCHAR(30),
                "phoneNumberTow" VARCHAR(30),
                fax VARCHAR(100),
                email VARCHAR(100),
                website VARCHAR(150),
                notes VARCHAR(300),
                "createdAt" TIMESTAMP, 
                "createdBy" INT,
                "lastUpdateAt" TIMESTAMP,
                "lastUpdateBy" INT,
                CONSTRAINT fk_created_by FOREIGN KEY("createdBy") REFERENCES users(id),
                CONSTRAINT fk_last_updated_by FOREIGN KEY("lastUpdateBy") REFERENCES users(id)
            );
        `);
        await AppDataSource.manager.query(`
            CREATE TABLE IF NOT EXISTS customers (
                id SERIAL PRIMARY KEY NOT NULL,
                code VARCHAR(16),
                name VARCHAR(100),
                debt NUMERIC(10, 2),
                address VARCHAR(200),
                "postalCode" VARCHAR(30),
                province VARCHAR(30),
                city VARCHAR(30),
                "phoneNumberOne" VARCHAR(30),
                "phoneNumberTow" VARCHAR(30),
                fax VARCHAR(100),
                email VARCHAR(100),
                website VARCHAR(150),
                notes VARCHAR(300),
                "createdAt" TIMESTAMP, 
                "createdBy" INT,
                "lastUpdateAt" TIMESTAMP,
                "lastUpdateBy" INT,
                CONSTRAINT fk_created_by FOREIGN KEY("createdBy") REFERENCES users(id),
                CONSTRAINT fk_last_updated_by FOREIGN KEY("lastUpdateBy") REFERENCES users(id)
            );
        `);

        await AppDataSource.manager.query(`
            CREATE TABLE IF NOT EXISTS employees (
                id SERIAL PRIMARY KEY NOT NULL,
                code VARCHAR(16),
                name VARCHAR(100),
                salary NUMERIC(10, 2),
                debt NUMERIC(10, 2),
                address VARCHAR(200),
                "postalCode" VARCHAR(30),
                province VARCHAR(30),
                city VARCHAR(30),
                "phoneNumberOne" VARCHAR(30),
                "phoneNumberTow" VARCHAR(30),
                fax VARCHAR(100),
                email VARCHAR(100),
                website VARCHAR(150),
                notes VARCHAR(300),
                "createdAt" TIMESTAMP, 
                "createdBy" INT,
                "lastUpdateAt" TIMESTAMP,
                "lastUpdateBy" INT,
                CONSTRAINT fk_created_by FOREIGN KEY("createdBy") REFERENCES users(id),
                CONSTRAINT fk_last_updated_by FOREIGN KEY("lastUpdateBy") REFERENCES users(id)
            );
        `);

        await AppDataSource.manager.query(`
            CREATE TABLE IF NOT EXISTS charge_natures (
                id SERIAL PRIMARY KEY NOT NULL,
                code VARCHAR(16),
                label VARCHAR(100),
                notes VARCHAR(300),
                "createdAt" TIMESTAMP, 
                "createdBy" INT,
                "lastUpdateAt" TIMESTAMP,
                "lastUpdateBy" INT,
                CONSTRAINT fk_created_by FOREIGN KEY("createdBy") REFERENCES users(id),
                CONSTRAINT fk_last_updated_by FOREIGN KEY("lastUpdateBy") REFERENCES users(id)
            );
        `);

        await AppDataSource.manager.query(`
            CREATE TABLE IF NOT EXISTS losse_natures (
                id SERIAL PRIMARY KEY NOT NULL,
                code VARCHAR(16),
                label VARCHAR(100),
                notes VARCHAR(300),
                "createdAt" TIMESTAMP, 
                "createdBy" INT,
                "lastUpdateAt" TIMESTAMP,
                "lastUpdateBy" INT,
                CONSTRAINT fk_created_by FOREIGN KEY("createdBy") REFERENCES users(id),
                CONSTRAINT fk_last_updated_by FOREIGN KEY("lastUpdateBy") REFERENCES users(id)
            );
        `);

        await AppDataSource.manager.query(`
            CREATE TABLE IF NOT EXISTS stocks (
                id SERIAL PRIMARY KEY NOT NULL,
                code VARCHAR(16),
                label VARCHAR(100),
                "categoryId" INT,
                "salePrice" NUMERIC(10, 2),
                "quantity" REAL,
                "amount" NUMERIC(10, 2),
                "status" VARCHAR(10),                
                notes VARCHAR(300),
                "createdAt" TIMESTAMP, 
                "createdBy" INT,
                "lastUpdateAt" TIMESTAMP,
                "lastUpdateBy" INT,
                CONSTRAINT fk_category_id FOREIGN KEY("categoryId") REFERENCES categories(id),
                CONSTRAINT fk_created_by FOREIGN KEY("createdBy") REFERENCES users(id),
                CONSTRAINT fk_last_updated_by FOREIGN KEY("lastUpdateBy") REFERENCES users(id)
            );
        `);

        await AppDataSource.manager.query(`
            CREATE TABLE IF NOT EXISTS ingredients (
                id SERIAL PRIMARY KEY NOT NULL,
                code VARCHAR(16),
                label VARCHAR(100),
                notes VARCHAR(300),
                "createdAt" TIMESTAMP, 
                "createdBy" INT,
                "lastUpdateAt" TIMESTAMP,
                "lastUpdateBy" INT,
                CONSTRAINT fk_created_by FOREIGN KEY("createdBy") REFERENCES users(id),
                CONSTRAINT fk_last_updated_by FOREIGN KEY("lastUpdateBy") REFERENCES users(id)
            );
        `);

    }
}