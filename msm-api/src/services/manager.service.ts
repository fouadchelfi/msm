import { Injectable } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { CustomerEntity, EmployeeEntity, MoneySourceEntity, PremiseEntity, StockEntity, SupplierEntity } from 'src/entities';
import { repo } from 'src/utils';

@Injectable()
export class ManagerService {

    async updateStockQuantity(productId: any, quantity: any, operation: 'add' | 'replace') {
        let stockDb = await repo(StockEntity)
            .createQueryBuilder('stock')
            .where('stock.id = :id', { id: productId })
            .getOne();
        await AppDataSource
            .createQueryBuilder()
            .update(StockEntity)
            .set({ quantity: operation == 'replace' ? parseFloat(quantity) : parseFloat(stockDb.quantity) + parseFloat(quantity) })
            .where("id = :id", { id: productId })
            .execute();
    }

    async updateEmployeeDebt(employeeId: any, amount: any, operation: 'add' | 'replace') {
        let employee = await repo(EmployeeEntity)
            .createQueryBuilder('employee')
            .where('employee.id = :id', { id: employeeId })
            .getOne();
        await AppDataSource
            .createQueryBuilder()
            .update(EmployeeEntity)
            .set({ debt: operation == 'add' ? parseFloat(employee.debt) + parseFloat(amount) : parseFloat(amount) })
            .where("id = :id", { id: employeeId })
            .execute();
    }

    async updateMoneySourceAmount(sourceId: any, amount: any, operation: 'add' | 'replace') {
        let source = await repo(MoneySourceEntity)
            .createQueryBuilder('source')
            .where('source.id = :id', { id: sourceId })
            .getOne();
        await AppDataSource
            .createQueryBuilder()
            .update(MoneySourceEntity)
            .set({ amount: operation == 'add' ? parseFloat(source.amount) + parseFloat(amount) : parseFloat(amount) })
            .where("id = :id", { id: sourceId })
            .execute();
    }

    async updateSupplierDebt(supplierId: any, amount: any, operation: 'add' | 'replace') {
        let supplier = await repo(SupplierEntity)
            .createQueryBuilder('supplier')
            .where('supplier.id = :id', { id: supplierId })
            .getOne();
        await AppDataSource
            .createQueryBuilder()
            .update(SupplierEntity)
            .set({ debt: operation == 'add' ? parseFloat(supplier.debt) + parseFloat(amount) : parseFloat(amount) })
            .where("id = :id", { id: supplierId })
            .execute();
    }

    async updateCustomerDebt(customerId: any, amount: any, operation: 'add' | 'replace') {
        let customer = await repo(CustomerEntity)
            .createQueryBuilder('customer')
            .where('customer.id = :id', { id: customerId })
            .getOne();
        await AppDataSource
            .createQueryBuilder()
            .update(CustomerEntity)
            .set({ debt: operation == 'add' ? parseFloat(customer.debt) + parseFloat(amount) : parseFloat(amount) })
            .where("id = :id", { id: customerId })
            .execute();
    }

    async updatePremiseDebt(premiseId: any, amount: any, operation: 'add' | 'replace') {
        let premise = await repo(PremiseEntity)
            .createQueryBuilder('premise')
            .where('premise.id = :id', { id: premiseId })
            .getOne();
        await AppDataSource
            .createQueryBuilder()
            .update(PremiseEntity)
            .set({ debt: operation == 'add' ? parseFloat(premise.debt) + parseFloat(amount) : parseFloat(amount) })
            .where("id = :id", { id: premiseId })
            .execute();
    }

}
