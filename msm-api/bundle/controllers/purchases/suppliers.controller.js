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
exports.SuppliersController = void 0;
const common_1 = require("@nestjs/common");
const entities_1 = require("../../entities");
const utils_1 = require("../../utils");
let SuppliersController = class SuppliersController {
    async getAllSuppliers() {
        return await queryAll().getMany();
    }
    async getOneCategoyById(id) {
        return await queryAll()
            .where('supplier.id = :id', { id })
            .getOne();
    }
    async paginateSupplier(query) {
        let result = queryAll();
        if ((0, utils_1.isNotEmpty)(query.name))
            result = result.where("TRIM(LOWER(supplier.name)) LIKE :name", { name: `%${query.name.toLowerCase().trim()}%` });
        if ((0, utils_1.isNotEmpty)(query.fromCreatedAt) && (0, utils_1.isNotEmpty)(query.toCreatedAt))
            result = result.andWhere('DATE(supplier.createdAt) >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('DATE(supplier.createdAt) <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });
        if ((0, utils_1.isNotEmpty)(query.fromLastUpdateAt) && (0, utils_1.isNotEmpty)(query.toLastUpdateAt))
            result = result.andWhere('DATE(supplier.lastUpdateAt) >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('DATE(supplier.lastUpdateAt) <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });
        result = await result
            .orderBy(`supplier.id`, query.order)
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
    async createSupplier(body, currentUser) {
        let errors = await validateSupplier(body);
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
        let dbSupplier = await (0, utils_1.repo)(entities_1.SupplierEntity).save(creation);
        if ((0, utils_1.isEmpty)(dbSupplier.code))
            await (0, utils_1.repo)(entities_1.SupplierEntity).update(dbSupplier.id, { ...creation, code: (0, utils_1.code)('FOU', dbSupplier.id) });
        return {
            success: true,
            errors: [],
            data: await this.getOneCategoyById(dbSupplier.id)
        };
    }
    async updateSupplier(id, body, currentUser) {
        let errors = await validateSupplier(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        await (0, utils_1.repo)(entities_1.SupplierEntity).update(body.id, {
            id: body.id,
            code: (0, utils_1.isEmpty)(body.code) ? (0, utils_1.code)('FOU', id) : body.code,
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
        await (0, utils_1.repo)(entities_1.SupplierEntity).delete(ids);
        return { success: true };
    }
};
exports.SuppliersController = SuppliersController;
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "getAllSuppliers", null);
__decorate([
    (0, common_1.Get)('one/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "getOneCategoyById", null);
__decorate([
    (0, common_1.Get)('pagination'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "paginateSupplier", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "createSupplier", null);
__decorate([
    (0, common_1.Put)('one/update/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "updateSupplier", null);
__decorate([
    (0, common_1.Delete)('many'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "deleteMany", null);
exports.SuppliersController = SuppliersController = __decorate([
    (0, common_1.UseGuards)(utils_1.AuthGuard),
    (0, common_1.Controller)('suppliers')
], SuppliersController);
async function validateSupplier(supplier) {
    let errors = [];
    let supplierDbCode = await (0, utils_1.repo)(entities_1.SupplierEntity).createQueryBuilder('supplier').where("supplier.code = :code", { code: `${supplier.code}` }).getOne();
    if (supplierDbCode && supplierDbCode.id != supplier.id)
        errors.push("Code existe déjà");
    let supplierDbName = await (0, utils_1.repo)(entities_1.SupplierEntity).createQueryBuilder('supplier').where("TRIM(LOWER(supplier.name)) = :name", { name: `${supplier.name.toLowerCase().trim()}` }).getOne();
    if (supplierDbName && supplierDbName.id != supplier.id)
        errors.push("Nom existe déjà");
    return errors.length == 0 ? null : errors;
}
function queryAll() {
    return (0, utils_1.repo)(entities_1.SupplierEntity)
        .createQueryBuilder('supplier')
        .leftJoinAndSelect('supplier.createdBy', 'createdBy')
        .leftJoinAndSelect('supplier.lastUpdateBy', 'lastUpdateBy')
        .select([
        'supplier.id',
        'supplier.code',
        'supplier.name',
        'supplier.debt',
        'supplier.phoneNumberOne',
        'supplier.phoneNumberTow',
        'supplier.postalCode',
        'supplier.province',
        'supplier.city',
        'supplier.address',
        'supplier.fax',
        'supplier.email',
        'supplier.website',
        'supplier.notes',
        'supplier.createdAt',
        'supplier.lastUpdateAt',
        'createdBy',
        'lastUpdateBy'
    ]);
}
//# sourceMappingURL=suppliers.controller.js.map