import { Injectable } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { UserEntity } from 'src/entities';
import { currentDateTime, repo } from 'src/utils';
import * as bcrypt from 'bcrypt';
import { config } from 'src/app.config';

@Injectable()
export class DbService {
    constructor() { }

    checkDb() {
        this.checkTables();
        this.checkAdminUser();
    }

    async checkTables() {
        //Users
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

        //Categories
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

        //Families
        await AppDataSource.manager.query(`
            CREATE TABLE IF NOT EXISTS families (
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

        //Suppliers
        await AppDataSource.manager.query(`
            CREATE TABLE IF NOT EXISTS suppliers (
                id SERIAL PRIMARY KEY NOT NULL,
                code VARCHAR(16),
                name VARCHAR(100),
                debt NUMERIC(16, 2),
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

        //Customers
        await AppDataSource.manager.query(`
            CREATE TABLE IF NOT EXISTS customers (
                id SERIAL PRIMARY KEY NOT NULL,
                code VARCHAR(16),
                name VARCHAR(100),
                debt NUMERIC(16, 2),
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

        //Employees
        await AppDataSource.manager.query(`
            CREATE TABLE IF NOT EXISTS employees (
                id SERIAL PRIMARY KEY NOT NULL,
                code VARCHAR(16),
                name VARCHAR(100),
                salary NUMERIC(16, 2),
                debt NUMERIC(16, 2),
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

        //Charge Natures
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

        //Losse Natures
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

        //Stocks
        await AppDataSource.manager.query(`
            CREATE TABLE IF NOT EXISTS stocks (
                id SERIAL PRIMARY KEY NOT NULL,
                code VARCHAR(16),
                label VARCHAR(100),
                "familyId" INT,
                "categoryId" INT,
                "salePrice" NUMERIC(16, 2),
                "quantity" REAL,
                "amount" NUMERIC(16, 2),
                "status" VARCHAR(10),                
                notes VARCHAR(300),
                "createdAt" TIMESTAMP, 
                "createdBy" INT,
                "lastUpdateAt" TIMESTAMP,
                "lastUpdateBy" INT,
                CONSTRAINT fk_family_id FOREIGN KEY("familyId") REFERENCES families(id),
                CONSTRAINT fk_category_id FOREIGN KEY("categoryId") REFERENCES categories(id),
                CONSTRAINT fk_created_by FOREIGN KEY("createdBy") REFERENCES users(id),
                CONSTRAINT fk_last_updated_by FOREIGN KEY("lastUpdateBy") REFERENCES users(id)
            );
        `);

        //Ingredients
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

        //Money Sources
        await AppDataSource.manager.query(`
            CREATE TABLE IF NOT EXISTS money_sources (
                id SERIAL PRIMARY KEY NOT NULL,
                code VARCHAR(16),
                label VARCHAR(100),
                nature VARCHAR(100),
                amount NUMERIC(16,2),
                notes VARCHAR(300),
                "createdAt" TIMESTAMP, 
                "createdBy" INT,
                "lastUpdateAt" TIMESTAMP,
                "lastUpdateBy" INT,
                CONSTRAINT fk_created_by FOREIGN KEY("createdBy") REFERENCES users(id),
                CONSTRAINT fk_last_updated_by FOREIGN KEY("lastUpdateBy") REFERENCES users(id)
            );
        `);

        //Charges
        await AppDataSource.manager.query(`
            CREATE TABLE IF NOT EXISTS charges (
                id SERIAL PRIMARY KEY NOT NULL,
                code VARCHAR(16),
                label VARCHAR(100),
                "chargeNatureId" INT,
                "moneySourceId" INT,
                amount NUMERIC(16,2),
                date DATE,
                notes VARCHAR(300),
                "createdAt" TIMESTAMP, 
                "createdBy" INT,
                "lastUpdateAt" TIMESTAMP,
                "lastUpdateBy" INT,
                CONSTRAINT fk_money_source_id FOREIGN KEY("moneySourceId") REFERENCES money_sources(id),
                CONSTRAINT fk_charge_nature_id FOREIGN KEY("chargeNatureId") REFERENCES charge_natures(id),
                CONSTRAINT fk_created_by FOREIGN KEY("createdBy") REFERENCES users(id),
                CONSTRAINT fk_last_updated_by FOREIGN KEY("lastUpdateBy") REFERENCES users(id)
            );
        `);

        //Losses
        await AppDataSource.manager.query(`
            CREATE TABLE IF NOT EXISTS losses (
                id SERIAL PRIMARY KEY NOT NULL,
                code VARCHAR(16),
                label VARCHAR(100),
                "losseNatureId" INT,
                "moneySourceId" INT,
                amount NUMERIC(16,2),
                date DATE,
                notes VARCHAR(300),
                "createdAt" TIMESTAMP, 
                "createdBy" INT,
                "lastUpdateAt" TIMESTAMP,
                "lastUpdateBy" INT,
                CONSTRAINT fk_money_source_id FOREIGN KEY("moneySourceId") REFERENCES money_sources(id),
                CONSTRAINT fk_losse_nature_id FOREIGN KEY("losseNatureId") REFERENCES losse_natures(id),
                CONSTRAINT fk_created_by FOREIGN KEY("createdBy") REFERENCES users(id),
                CONSTRAINT fk_last_updated_by FOREIGN KEY("lastUpdateBy") REFERENCES users(id)
            );
        `);

        //Quantity Corrections
        await AppDataSource.manager.query(`
            CREATE TABLE IF NOT EXISTS quantity_corrections (
                id SERIAL PRIMARY KEY NOT NULL,
                code VARCHAR(16),
                "stockId" INT,
                "oldQuantity" REAL,
                "newQuantity" REAL,
                date DATE,
                notes VARCHAR(300),
                "createdAt" TIMESTAMP, 
                "createdBy" INT, 
                "lastUpdateAt" TIMESTAMP,
                "lastUpdateBy" INT,
                CONSTRAINT fk_stock_id FOREIGN KEY("stockId") REFERENCES stocks(id),
                CONSTRAINT fk_created_by FOREIGN KEY("createdBy") REFERENCES users(id),
                CONSTRAINT fk_last_updated_by FOREIGN KEY("lastUpdateBy") REFERENCES users(id)
            );
        `);

        //Status Transfers
        await AppDataSource.manager.query(`
            CREATE TABLE IF NOT EXISTS status_transfers (
                id SERIAL PRIMARY KEY NOT NULL,
                code VARCHAR(16),
                "freeStockId" INT,
                "frozenStockId" INT,
                "transferedQuantity" REAL,
                "oldFreeQuantity" REAL,
                "newFreeQuantity" REAL,
                "oldFrozenQuantity" REAL,
                "newFrozenQuantity" REAL,
                date DATE,
                notes VARCHAR(300),
                "createdAt" TIMESTAMP, 
                "createdBy" INT,
                "lastUpdateAt" TIMESTAMP,
                "lastUpdateBy" INT,
                CONSTRAINT fk_free_stock_id FOREIGN KEY("freeStockId") REFERENCES stocks(id),
                CONSTRAINT fk_frozen_stock_id FOREIGN KEY("frozenStockId") REFERENCES stocks(id),
                CONSTRAINT fk_created_by FOREIGN KEY("createdBy") REFERENCES users(id),
                CONSTRAINT fk_last_updated_by FOREIGN KEY("lastUpdateBy") REFERENCES users(id)
            );
        `);

        //Premises
        await AppDataSource.manager.query(`
            CREATE TABLE IF NOT EXISTS premises (
                id SERIAL PRIMARY KEY NOT NULL,
                code VARCHAR(16),
                label VARCHAR(100),
                debt NUMERIC(16,2),
                notes VARCHAR(300),
                "createdAt" TIMESTAMP, 
                "createdBy" INT,
                "lastUpdateAt" TIMESTAMP,
                "lastUpdateBy" INT,
                CONSTRAINT fk_created_by FOREIGN KEY("createdBy") REFERENCES users(id),
                CONSTRAINT fk_last_updated_by FOREIGN KEY("lastUpdateBy") REFERENCES users(id)
            );
        `);

        //Punches Pointages
        await AppDataSource.manager.query(`
            CREATE TABLE IF NOT EXISTS punches (
                id SERIAL PRIMARY KEY NOT NULL,
                code VARCHAR(16),
                "employeeId" INT,
                date DATE,
                "salary" NUMERIC(10,2),
                "hourlyCoefficient" REAL,
                "amount" NUMERIC(10,2),
                notes VARCHAR(300),
                "createdAt" TIMESTAMP, 
                "createdBy" INT,
                "lastUpdateAt" TIMESTAMP,
                "lastUpdateBy" INT,
                CONSTRAINT fk_employee_id FOREIGN KEY("employeeId") REFERENCES employees(id),
                CONSTRAINT fk_created_by FOREIGN KEY("createdBy") REFERENCES users(id),
                CONSTRAINT fk_last_updated_by FOREIGN KEY("lastUpdateBy") REFERENCES users(id)
            );
        `);

        //Employee Credits (Accounts)
        await AppDataSource.manager.query(`
            CREATE TABLE IF NOT EXISTS employee_credits (
                id SERIAL PRIMARY KEY NOT NULL,
                code VARCHAR(16),
                "employeeId" INT,
                "moneySourceId" INT,
                amount NUMERIC(16,2),
                date DATE,
                notes VARCHAR(300),
                "createdAt" TIMESTAMP, 
                "createdBy" INT,
                "lastUpdateAt" TIMESTAMP,
                "lastUpdateBy" INT,
                CONSTRAINT fk_money_source_id FOREIGN KEY("moneySourceId") REFERENCES money_sources(id),
                CONSTRAINT fk_employee_id FOREIGN KEY("employeeId") REFERENCES employees(id),
                CONSTRAINT fk_created_by FOREIGN KEY("createdBy") REFERENCES users(id),
                CONSTRAINT fk_last_updated_by FOREIGN KEY("lastUpdateBy") REFERENCES users(id)
            );
        `);

        //Employeee Payments
        await AppDataSource.manager.query(`
            CREATE TABLE IF NOT EXISTS employee_payments (
                id SERIAL PRIMARY KEY NOT NULL,
                code VARCHAR(16),
                "employeeId" INT,
                "moneySourceId" INT,
                "moneySourceAmount" NUMERIC(16,2),
                date DATE,
                "calculatedPayment" NUMERIC(16,2),
                "payment" NUMERIC(16,2),
                "restPayment" NUMERIC(16,2),
                notes VARCHAR(300),
                "createdAt" TIMESTAMP, 
                "createdBy" INT,
                "lastUpdateAt" TIMESTAMP,
                "lastUpdateBy" INT,
                CONSTRAINT fk_money_source_id FOREIGN KEY("moneySourceId") REFERENCES money_sources(id),
                CONSTRAINT fk_employee_id FOREIGN KEY("employeeId") REFERENCES employees(id),
                CONSTRAINT fk_created_by FOREIGN KEY("createdBy") REFERENCES users(id),
                CONSTRAINT fk_last_updated_by FOREIGN KEY("lastUpdateBy") REFERENCES users(id)
            );
        `);

        //Money Source Transfers
        await AppDataSource.manager.query(`
            CREATE TABLE IF NOT EXISTS money_source_transfers (
                id SERIAL PRIMARY KEY NOT NULL,
                code VARCHAR(16),
                "fromMoneySourceId" INT,
                "toMoneySourceId" INT,
                amount NUMERIC(16,2),
                "oldFromMoneySourceAmount" NUMERIC(16,2),
                "newFromMoneySourceAmount" NUMERIC(16,2),
                "oldToMoneySourceAmount" NUMERIC(16,2),
                "newToMoneySourceAmount" NUMERIC(16,2),
                date DATE,
                notes VARCHAR(300),
                "createdAt" TIMESTAMP, 
                "createdBy" INT,
                "lastUpdateAt" TIMESTAMP,
                "lastUpdateBy" INT,
                CONSTRAINT fk_from_money_source_id FOREIGN KEY("fromMoneySourceId") REFERENCES money_sources(id),
                CONSTRAINT fk_to_money_source_id FOREIGN KEY("toMoneySourceId") REFERENCES money_sources(id),
                CONSTRAINT fk_created_by FOREIGN KEY("createdBy") REFERENCES users(id),
                CONSTRAINT fk_last_updated_by FOREIGN KEY("lastUpdateBy") REFERENCES users(id)
            );
        `);

        //Purchases
        await AppDataSource.manager.query(`
            CREATE TABLE IF NOT EXISTS purchases (
                id SERIAL PRIMARY KEY NOT NULL,
                code VARCHAR(16),
                "totalQuantity" REAL,
                "totalAmount" NUMERIC(16,2),
                cost NUMERIC(16,2),
                payment NUMERIC(16,2),
                "moneySourceId" INT,
                "supplierId" INT,
                date DATE,
                notes VARCHAR(300),
                "createdAt" TIMESTAMP, 
                "createdBy" INT,
                "lastUpdateAt" TIMESTAMP,
                "lastUpdateBy" INT,
                CONSTRAINT fk_money_source_id FOREIGN KEY("moneySourceId") REFERENCES money_sources(id),
                CONSTRAINT fk_supplier_id FOREIGN KEY("supplierId") REFERENCES suppliers(id),
                CONSTRAINT fk_created_by FOREIGN KEY("createdBy") REFERENCES users(id),
                CONSTRAINT fk_last_updated_by FOREIGN KEY("lastUpdateBy") REFERENCES users(id)
            );
            CREATE TABLE IF NOT EXISTS purchase_items (
                id SERIAL PRIMARY KEY NOT NULL,
                "stockId" INT,
                quantity REAL,
                "salePrice" NUMERIC(16,2),
                amount NUMERIC(16,2),
                "purchaseId" INT,
                CONSTRAINT fk_stock_id FOREIGN KEY("stockId") REFERENCES stocks(id),
                CONSTRAINT fk_purchase_id FOREIGN KEY("purchaseId") REFERENCES purchases(id)
            );
        `);

        //Sales
        await AppDataSource.manager.query(`
            CREATE TABLE IF NOT EXISTS sales (
                id SERIAL PRIMARY KEY NOT NULL,
                code VARCHAR(16),
                "totalQuantity" REAL,
                "totalAmount" NUMERIC(16,2),
                payment NUMERIC(16,2),
                "deliveryAmount" NUMERIC(16,2),
                "moneySourceId" INT,
                "customerId" INT,
                date DATE,
                notes VARCHAR(300),
                "createdAt" TIMESTAMP, 
                "createdBy" INT,
                "lastUpdateAt" TIMESTAMP,
                "lastUpdateBy" INT,
                CONSTRAINT fk_money_source_id FOREIGN KEY("moneySourceId") REFERENCES money_sources(id),
                CONSTRAINT fk_customer_id FOREIGN KEY("customerId") REFERENCES customers(id),
                CONSTRAINT fk_created_by FOREIGN KEY("createdBy") REFERENCES users(id),
                CONSTRAINT fk_last_updated_by FOREIGN KEY("lastUpdateBy") REFERENCES users(id)
            );
            CREATE TABLE IF NOT EXISTS sale_items (
                id SERIAL PRIMARY KEY NOT NULL,
                "stockId" INT,
                quantity REAL,
                "salePrice" NUMERIC(16,2),
                amount NUMERIC(16,2),
                "saleId" INT,
                CONSTRAINT fk_stock_id FOREIGN KEY("stockId") REFERENCES stocks(id),
                CONSTRAINT fk_sale_id FOREIGN KEY("saleId") REFERENCES sales(id)
            );
        `);

        //Distributions
        await AppDataSource.manager.query(`
            CREATE TABLE IF NOT EXISTS distributions (
                id SERIAL PRIMARY KEY NOT NULL,
                code VARCHAR(16),
                "totalQuantity" REAL,
                "totalAmount" NUMERIC(16,2),
                cash NUMERIC(16,2),
                "moneySourceId" INT,
                "premiseId" INT,
                date DATE,
                notes VARCHAR(300),
                "createdAt" TIMESTAMP, 
                "createdBy" INT,
                "lastUpdateAt" TIMESTAMP,
                "lastUpdateBy" INT,
                CONSTRAINT fk_money_source_id FOREIGN KEY("moneySourceId") REFERENCES money_sources(id),
                CONSTRAINT fk_premise_id FOREIGN KEY("premiseId") REFERENCES premises(id),
                CONSTRAINT fk_created_by FOREIGN KEY("createdBy") REFERENCES users(id),
                CONSTRAINT fk_last_updated_by FOREIGN KEY("lastUpdateBy") REFERENCES users(id)
            );
            CREATE TABLE IF NOT EXISTS distribution_items (
                id SERIAL PRIMARY KEY NOT NULL,
                "stockId" INT,
                quantity REAL,
                "salePrice" NUMERIC(16,2),
                amount NUMERIC(16,2),
                "distributionId" INT,
                CONSTRAINT fk_stock_id FOREIGN KEY("stockId") REFERENCES stocks(id),
                CONSTRAINT fk_distribution_id FOREIGN KEY("distributionId") REFERENCES distributions(id)
            );
        `);

        //Premise Returns
        await AppDataSource.manager.query(`
            CREATE TABLE IF NOT EXISTS premise_returns (
                id SERIAL PRIMARY KEY NOT NULL,
                code VARCHAR(16),
                "totalQuantity" REAL,
                "totalAmount" NUMERIC(16,2),
                "returnedCash" NUMERIC(16,2),
                "moneySourceId" INT,
                "premiseId" INT,
                date DATE,
                notes VARCHAR(300),
                "createdAt" TIMESTAMP, 
                "createdBy" INT,
                "lastUpdateAt" TIMESTAMP,
                "lastUpdateBy" INT,
                CONSTRAINT fk_money_source_id FOREIGN KEY("moneySourceId") REFERENCES money_sources(id),
                CONSTRAINT fk_premise_id FOREIGN KEY("premiseId") REFERENCES premises(id),
                CONSTRAINT fk_created_by FOREIGN KEY("createdBy") REFERENCES users(id),
                CONSTRAINT fk_last_updated_by FOREIGN KEY("lastUpdateBy") REFERENCES users(id)
            );
            CREATE TABLE IF NOT EXISTS premise_return_items (
                id SERIAL PRIMARY KEY NOT NULL,
                "stockId" INT,
                quantity REAL,
                "salePrice" NUMERIC(16,2),
                amount NUMERIC(16,2),
                "premiseReturnId" INT,
                CONSTRAINT fk_stock_id FOREIGN KEY("stockId") REFERENCES stocks(id),
                CONSTRAINT fk_premise_return_id FOREIGN KEY("premiseReturnId") REFERENCES premise_returns(id)
            );
        `);

        //Production Batches
        await AppDataSource.manager.query(`
            CREATE TABLE IF NOT EXISTS batches (
                id SERIAL PRIMARY KEY NOT NULL,
                code VARCHAR(16),
                productId INT,
                "totalQuantity" REAL,
                "totalAmount" NUMERIC(16,2),
                "moneySourceId" INT,
                date DATE,
                notes VARCHAR(300),
                "createdAt" TIMESTAMP, 
                "createdBy" INT,
                "lastUpdateAt" TIMESTAMP,
                "lastUpdateBy" INT,
                CONSTRAINT fk_product_id FOREIGN KEY("productId") REFERENCES stocks(id),
                CONSTRAINT fk_money_source_id FOREIGN KEY("moneySourceId") REFERENCES money_sources(id),
                CONSTRAINT fk_created_by FOREIGN KEY("createdBy") REFERENCES users(id),
                CONSTRAINT fk_last_updated_by FOREIGN KEY("lastUpdateBy") REFERENCES users(id)
            );
            CREATE TABLE IF NOT EXISTS batch_items (
                id SERIAL PRIMARY KEY NOT NULL,
                "stockId" INT,
                quantity REAL,
                amount NUMERIC(16,2),
                "batchId" INT,
                CONSTRAINT fk_stock_id FOREIGN KEY("stockId") REFERENCES stocks(id),
                CONSTRAINT fk_batch_id FOREIGN KEY("batchId") REFERENCES batches(id)
            );
            CREATE TABLE IF NOT EXISTS batch_ingredients (
                id SERIAL PRIMARY KEY NOT NULL,
                "ingredientId" INT,
                quantity REAL,
                amount NUMERIC(16,2),
                "batchId" INT,
                CONSTRAINT fk_ingredient_id FOREIGN KEY("ingredientId") REFERENCES ingredients(id),
                CONSTRAINT fk_batch_id FOREIGN KEY("batchId") REFERENCES batches(id)
            );
        `);

        //Fences (Clôtures)
        await AppDataSource.manager.query(`
            CREATE TABLE IF NOT EXISTS fences (
                id SERIAL PRIMARY KEY NOT NULL,
                code VARCHAR(16),
                "inStockQuantity" REAL,
                "inStockQuantityAmount" NUMERIC(16,2),
                "calculatedInStockQuantity" REAL,
                "calculatedInStockQuantityAmount" NUMERIC(16,2),
                "totalPurchaseAmount" NUMERIC(16,2),
                "totalSaleAmount" NUMERIC(16,2),
                "turnover" NUMERIC(16,2),
                "marginProfit" NUMERIC(16,2),
                "categoryId" INT,
                date DATE,
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
    }

    async checkAdminUser() {
        let exists = await repo(UserEntity).createQueryBuilder('user').where('user.name = :name', { name: 'admin' }).getExists();
        if (!exists) {
            let creation = {
                name: 'admin',
                password: await bcrypt.hash('admin', config.saltOrRounds),
                code: 'admin',
                notes: 'Créé par défaut.',
                createdAt: currentDateTime(),
                createdBy: 1,
                lastUpdateAt: currentDateTime(),
                lastUpdateBy: 1
            };
            await repo(UserEntity).save(creation);
        }
    }
}