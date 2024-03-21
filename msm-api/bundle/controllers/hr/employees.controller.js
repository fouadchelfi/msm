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
exports.EmployeesController = void 0;
const common_1 = require("@nestjs/common");
const entities_1 = require("../../entities");
const utils_1 = require("../../utils");
let EmployeesController = class EmployeesController {
    async getAllEmployees() {
        return await queryAll().getMany();
    }
    async getOneCategoyById(id) {
        return await queryAll()
            .where('employee.id = :id', { id })
            .getOne();
    }
    async paginateEmployee(query) {
        let result = queryAll();
        if ((0, utils_1.isNotEmpty)(query.name))
            result = result.where("TRIM(LOWER(employee.name)) LIKE :name", { name: `%${query.name.toLowerCase().trim()}%` });
        if ((0, utils_1.isNotEmpty)(query.fromCreatedAt) && (0, utils_1.isNotEmpty)(query.toCreatedAt))
            result = result.andWhere('DATE(employee.createdAt) >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('DATE(employee.createdAt) <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });
        if ((0, utils_1.isNotEmpty)(query.fromLastUpdateAt) && (0, utils_1.isNotEmpty)(query.toLastUpdateAt))
            result = result.andWhere('DATE(employee.lastUpdateAt) >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('DATE(employee.lastUpdateAt) <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });
        result = await result
            .orderBy(`employee.id`, query.order)
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
    async createEmployee(body, currentUser) {
        let errors = await validateEmployee(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        let creation = {
            code: body.code,
            name: body.name,
            salary: body.salary,
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
        let dbEmployee = await (0, utils_1.repo)(entities_1.EmployeeEntity).save(creation);
        if ((0, utils_1.isEmpty)(dbEmployee.code))
            await (0, utils_1.repo)(entities_1.EmployeeEntity).update(dbEmployee.id, { ...creation, code: (0, utils_1.code)('EMP', dbEmployee.id) });
        return {
            success: true,
            errors: [],
            data: await this.getOneCategoyById(dbEmployee.id)
        };
    }
    async updateEmployee(id, body, currentUser) {
        let errors = await validateEmployee(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        await (0, utils_1.repo)(entities_1.EmployeeEntity).update(body.id, {
            id: body.id,
            code: (0, utils_1.isEmpty)(body.code) ? (0, utils_1.code)('EMP', id) : body.code,
            name: body.name,
            salary: body.salary,
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
        await (0, utils_1.repo)(entities_1.EmployeeEntity).delete(ids);
        return { success: true };
    }
};
exports.EmployeesController = EmployeesController;
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "getAllEmployees", null);
__decorate([
    (0, common_1.Get)('one/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "getOneCategoyById", null);
__decorate([
    (0, common_1.Get)('pagination'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "paginateEmployee", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "createEmployee", null);
__decorate([
    (0, common_1.Put)('one/update/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "updateEmployee", null);
__decorate([
    (0, common_1.Delete)('many'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "deleteMany", null);
exports.EmployeesController = EmployeesController = __decorate([
    (0, common_1.UseGuards)(utils_1.AuthGuard),
    (0, common_1.Controller)('employees')
], EmployeesController);
async function validateEmployee(employee) {
    let errors = [];
    let employeeDbCode = await (0, utils_1.repo)(entities_1.EmployeeEntity).createQueryBuilder('employee').where("employee.code = :code", { code: `${employee.code}` }).getOne();
    if (employeeDbCode && employeeDbCode.id != employee.id)
        errors.push("Code existe déjà");
    let employeeDbName = await (0, utils_1.repo)(entities_1.EmployeeEntity).createQueryBuilder('employee').where("TRIM(LOWER(employee.name)) = :name", { name: `${employee.name.toLowerCase().trim()}` }).getOne();
    if (employeeDbName && employeeDbName.id != employee.id)
        errors.push("Nom existe déjà");
    return errors.length == 0 ? null : errors;
}
function queryAll() {
    return (0, utils_1.repo)(entities_1.EmployeeEntity)
        .createQueryBuilder('employee')
        .leftJoinAndSelect('employee.createdBy', 'createdBy')
        .leftJoinAndSelect('employee.lastUpdateBy', 'lastUpdateBy')
        .select([
        'employee.id',
        'employee.code',
        'employee.name',
        'employee.salary',
        'employee.debt',
        'employee.phoneNumberOne',
        'employee.phoneNumberTow',
        'employee.postalCode',
        'employee.province',
        'employee.city',
        'employee.address',
        'employee.fax',
        'employee.email',
        'employee.website',
        'employee.notes',
        'employee.createdAt',
        'employee.lastUpdateAt',
        'createdBy',
        'lastUpdateBy'
    ]);
}
//# sourceMappingURL=employees.controller.js.map