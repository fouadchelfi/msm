"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersController = void 0;
const common_1 = require("@nestjs/common");
const entities_1 = require("../../entities");
const utils_1 = require("../../utils");
let CustomersController = class CustomersController {
    async getAllCustomers() {
        return await queryAll().getMany();
    }
    async getOneCategoyById(id) {
        return await queryAll()
            .where('customer.id = :id', { id })
            .getOne();
    }
    async paginateCustomer(query) {
        let result = queryAll();
        if ((0, utils_1.isNotEmpty)(query.name))
            result = result.where("TRIM(LOWER(customer.name)) LIKE :name", { name: `%${query.name.toLowerCase().trim()}%` });
        if ((0, utils_1.isNotEmpty)(query.fromCreatedAt) && (0, utils_1.isNotEmpty)(query.toCreatedAt))
            result = result.andWhere('DATE(customer.createdAt) >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('DATE(customer.createdAt) <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });
        if ((0, utils_1.isNotEmpty)(query.fromLastUpdateAt) && (0, utils_1.isNotEmpty)(query.toLastUpdateAt))
            result = result.andWhere('DATE(customer.lastUpdateAt) >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('DATE(customer.lastUpdateAt) <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });
        result = await result
            .orderBy(`customer.id`, query.order)
            .skip(parseInt(query.pageIndex) * parseInt(query.pageSize))
            .take(parseInt(query.pageSize));
        let [items, count] = await result.getManyAndCount();
        return {
            order: query.order,
            sort: query.sort,
            pageIndex: parseInt(query.pageIndex),
            pageSize: parseInt(query.pageSize),
            items: items,
            count: count,
        };
    }
    async createCustomer(body, currentUser) {
        let errors = await validateCustomer(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        let creation = {
            code: body.code,
            name: body.name,
            debt: body.debt,
            address: body.address,
            postalCode: body.postalCode,
            province: body.province,
            city: body.city,
            phoneNumberOne: body.phoneNumberOne,
            phoneNumberTow: body.phoneNumberTow,
            fax: body.fax,
            email: body.email,
            website: body.website,
            notes: body.notes,
            createdAt: (0, utils_1.currentDateTime)(),
            createdBy: currentUser?.id,
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        };
        let dbCustomer = await (0, utils_1.repo)(entities_1.CustomerEntity).save(creation);
        if ((0, utils_1.isEmpty)(dbCustomer.code))
            await (0, utils_1.repo)(entities_1.CustomerEntity).update(dbCustomer.id, { ...creation, code: (0, utils_1.code)('CLT', dbCustomer.id) });
        return {
            success: true,
            errors: [],
            data: await this.getOneCategoyById(dbCustomer.id)
        };
    }
    async updateCustomer(id, body, currentUser) {
        let errors = await validateCustomer(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        await (0, utils_1.repo)(entities_1.CustomerEntity).update(body.id, {
            id: body.id,
            code: (0, utils_1.isEmpty)(body.code) ? (0, utils_1.code)('CLT', id) : body.code,
            name: body.name,
            debt: body.debt,
            address: body.address,
            postalCode: body.postalCode,
            province: body.province,
            city: body.city,
            phoneNumberOne: body.phoneNumberOne,
            phoneNumberTow: body.phoneNumberTow,
            fax: body.fax,
            email: body.email,
            website: body.website,
            notes: body.notes,
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        });
        return {
            success: true,
            errors: [],
            data: await this.getOneCategoyById(body.id)
        };
    }
    async deleteMany(query) {
        let ids = Object.values(query.id).map(id => parseInt(id));
        await (0, utils_1.repo)(entities_1.CustomerEntity).delete(ids);
        return { success: true };
    }
};
exports.CustomersController = CustomersController;
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getAllCustomers", null);
__decorate([
    (0, common_1.Get)('one/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getOneCategoyById", null);
__decorate([
    (0, common_1.Get)('pagination'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "paginateCustomer", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "createCustomer", null);
__decorate([
    (0, common_1.Put)('one/update/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "updateCustomer", null);
__decorate([
    (0, common_1.Delete)('many'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "deleteMany", null);
exports.CustomersController = CustomersController = __decorate([
    (0, common_1.UseGuards)(utils_1.AuthGuard),
    (0, common_1.Controller)('customers')
], CustomersController);
async function validateCustomer(customer) {
    let errors = [];
    let customerDbCode = await (0, utils_1.repo)(entities_1.CustomerEntity).createQueryBuilder('customer').where("customer.code = :code", { code: `${customer.code}` }).getOne();
    if (customerDbCode && customerDbCode.id != customer.id)
        errors.push("Code existe déjà");
    let customerDbName = await (0, utils_1.repo)(entities_1.CustomerEntity).createQueryBuilder('customer').where("TRIM(LOWER(customer.name)) = :name", { name: `${customer.name.toLowerCase().trim()}` }).getOne();
    if (customerDbName && customerDbName.id != customer.id)
        errors.push("Nom existe déjà");
    return errors.length == 0 ? null : errors;
}
function queryAll() {
    return (0, utils_1.repo)(entities_1.CustomerEntity)
        .createQueryBuilder('customer')
        .leftJoinAndSelect('customer.createdBy', 'createdBy')
        .leftJoinAndSelect('customer.lastUpdateBy', 'lastUpdateBy')
        .select([
        'customer.id',
        'customer.code',
        'customer.name',
        'customer.debt',
        'customer.phoneNumberOne',
        'customer.phoneNumberTow',
        'customer.postalCode',
        'customer.province',
        'customer.city',
        'customer.address',
        'customer.fax',
        'customer.email',
        'customer.website',
        'customer.notes',
        'customer.createdAt',
        'customer.lastUpdateAt',
        'createdBy',
        'lastUpdateBy'
    ]);
}
//# sourceMappingURL=customers.controller.js.map