"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerService = void 0;
const common_1 = require("@nestjs/common");
const data_source_1 = require("../data-source");
const entities_1 = require("../entities");
const utils_1 = require("../utils");
let ManagerService = class ManagerService {
    async updateStockQuantity(productId, quantity, operation) {
        let stockDb = await (0, utils_1.repo)(entities_1.StockEntity)
            .createQueryBuilder('stock')
            .where('stock.id = :id', { id: productId })
            .getOne();
        await data_source_1.AppDataSource
            .createQueryBuilder()
            .update(entities_1.StockEntity)
            .set({ quantity: operation == 'replace' ? parseFloat(quantity) : parseFloat(stockDb.quantity) + parseFloat(quantity) })
            .where("id = :id", { id: productId })
            .execute();
    }
    async updateEmployeeDebt(employeeId, amount, operation) {
        let employee = await (0, utils_1.repo)(entities_1.EmployeeEntity)
            .createQueryBuilder('employee')
            .where('employee.id = :id', { id: employeeId })
            .getOne();
        await data_source_1.AppDataSource
            .createQueryBuilder()
            .update(entities_1.EmployeeEntity)
            .set({ debt: operation == 'add' ? parseFloat(employee.debt) + parseFloat(amount) : parseFloat(amount) })
            .where("id = :id", { id: employeeId })
            .execute();
    }
    async updateMoneySourceAmount(sourceId, amount, operation) {
        let source = await (0, utils_1.repo)(entities_1.MoneySourceEntity)
            .createQueryBuilder('source')
            .where('source.id = :id', { id: sourceId })
            .getOne();
        await data_source_1.AppDataSource
            .createQueryBuilder()
            .update(entities_1.MoneySourceEntity)
            .set({ amount: operation == 'add' ? parseFloat(source.amount) + parseFloat(amount) : parseFloat(amount) })
            .where("id = :id", { id: sourceId })
            .execute();
    }
    async updateSupplierDebt(supplierId, amount, operation) {
        let supplier = await (0, utils_1.repo)(entities_1.SupplierEntity)
            .createQueryBuilder('supplier')
            .where('supplier.id = :id', { id: supplierId })
            .getOne();
        await data_source_1.AppDataSource
            .createQueryBuilder()
            .update(entities_1.SupplierEntity)
            .set({ debt: operation == 'add' ? parseFloat(supplier.debt) + parseFloat(amount) : parseFloat(amount) })
            .where("id = :id", { id: supplierId })
            .execute();
    }
    async updateCustomerDebt(customerId, amount, operation) {
        let customer = await (0, utils_1.repo)(entities_1.CustomerEntity)
            .createQueryBuilder('customer')
            .where('customer.id = :id', { id: customerId })
            .getOne();
        await data_source_1.AppDataSource
            .createQueryBuilder()
            .update(entities_1.CustomerEntity)
            .set({ debt: operation == 'add' ? parseFloat(customer.debt) + parseFloat(amount) : parseFloat(amount) })
            .where("id = :id", { id: customerId })
            .execute();
    }
    async updatePremiseDebt(premiseId, amount, operation) {
        let premise = await (0, utils_1.repo)(entities_1.PremiseEntity)
            .createQueryBuilder('premise')
            .where('premise.id = :id', { id: premiseId })
            .getOne();
        await data_source_1.AppDataSource
            .createQueryBuilder()
            .update(entities_1.PremiseEntity)
            .set({ debt: operation == 'add' ? parseFloat(premise.debt) + parseFloat(amount) : parseFloat(amount) })
            .where("id = :id", { id: premiseId })
            .execute();
    }
};
exports.ManagerService = ManagerService;
exports.ManagerService = ManagerService = __decorate([
    (0, common_1.Injectable)()
], ManagerService);
//# sourceMappingURL=manager.service.js.map