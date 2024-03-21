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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const entities_1 = require("../../entities");
const utils_1 = require("../../utils");
const bcrypt = require("bcrypt");
const app_config_1 = require("../../app.config");
let UsersController = class UsersController {
    async getAllUsers() {
        return await queryAll().getMany();
    }
    async getOneUserById(id) {
        return await queryAll()
            .where('user.id = :id', { id })
            .getOne();
    }
    async paginateUser(query) {
        let result = queryAll();
        if ((0, utils_1.isNotEmpty)(query.name))
            result = result.where("TRIM(LOWER(user.name)) LIKE :name", { name: `%${query.name.toLowerCase().trim()}%` });
        if ((0, utils_1.isNotEmpty)(query.fromCreatedAt) && (0, utils_1.isNotEmpty)(query.toCreatedAt))
            result = result.where('user.createdAt >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('user.createdAt <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });
        if ((0, utils_1.isNotEmpty)(query.fromLastUpdateAt) && (0, utils_1.isNotEmpty)(query.toLastUpdateAt))
            result = result.where('user.lastUpdateAt >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('user.lastUpdateAt <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });
        result = await result
            .skip(query.pageIndex * query.pageSize)
            .take(query.pageSize)
            .orderBy(`user.createdAt`, query.order);
        let [items, count] = await result.getManyAndCount();
        return {
            order: query.order,
            sort: query.sort,
            pageIndex: query.pageIndex,
            pageSize: query.pageSize,
            items: items,
            count: count,
        };
    }
    async createUser(body, currentUser) {
        let errors = await validateUser(body);
        if (errors)
            return { success: false, messages: errors, data: null };
        let creation = {
            code: body.code,
            name: body.name,
            password: await bcrypt.hash(body.password, app_config_1.config.saltOrRounds),
            notes: body.notes,
            createdAt: (0, utils_1.currentDateTime)(),
            createdBy: currentUser?.id,
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        };
        let dbUser = await (0, utils_1.repo)(entities_1.UserEntity).save(creation);
        if ((0, utils_1.isEmpty)(dbUser.code))
            await (0, utils_1.repo)(entities_1.UserEntity).update(dbUser.id, { ...creation, code: (0, utils_1.code)('USR', dbUser.id) });
        return {
            success: true,
            errors: [],
            data: await this.getOneUserById(dbUser.id)
        };
    }
    async updateUser(id, body, currentUser) {
        if (id == 1)
            throw new common_1.ForbiddenException('Vous ne pouvez pas modifier l’utilisateur admin.');
        let errors = await validateUser(body);
        if (errors)
            return { success: false, messages: errors, data: null };
        let update = {
            id: body.id,
            code: (0, utils_1.isEmpty)(body.code) ? (0, utils_1.code)('USR', id) : body.code,
            name: body.name,
            notes: body.notes,
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        };
        await (0, utils_1.repo)(entities_1.UserEntity).update(update.id, update);
        return {
            success: true,
            errors: [],
            data: await this.getOneUserById(update.id)
        };
    }
    async chargePassword(id, body, currentUser) {
        let adminDb = await (0, utils_1.repo)(entities_1.UserEntity).createQueryBuilder('user').where('user.name = :name', { name: 'admin' }).getOne();
        if (!adminDb || !(await bcrypt.compare(body.adminPassword, adminDb.password))) {
            return {
                success: false,
                errors: ["Vous ne pouvez pas modifier le mot de passe."]
            };
        }
        await (0, utils_1.repo)(entities_1.UserEntity).update(id, {
            password: await bcrypt.hash(body.newPassword, app_config_1.config.saltOrRounds),
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        });
        return {
            success: true,
            errors: [],
            data: await this.getOneUserById(body.userId)
        };
    }
    async deleteMany(query) {
        let ids = Object.values(query.id).map(id => parseInt(id)).filter(id => id != 1);
        if (ids.length > 0) {
            await (0, utils_1.repo)(entities_1.UserEntity).delete(ids);
            return { success: true };
        }
        return { success: false };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('one/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getOneUserById", null);
__decorate([
    (0, common_1.Get)('pagination'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "paginateUser", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
__decorate([
    (0, common_1.Put)('one/update/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Put)('one/change-password/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "chargePassword", null);
__decorate([
    (0, common_1.Delete)('many'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteMany", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.UseGuards)(utils_1.AuthGuard),
    (0, common_1.Controller)('users')
], UsersController);
async function validateUser(user) {
    let errors = [];
    let userDbCode = await (0, utils_1.repo)(entities_1.UserEntity).createQueryBuilder('user').where("user.code = :code", { code: `${user.code}` }).getOne();
    if (userDbCode && userDbCode.id != user.id)
        errors.push("Code existe déjà");
    let userDbName = await (0, utils_1.repo)(entities_1.UserEntity).createQueryBuilder('user').where("TRIM(LOWER(user.name)) = :name", { name: `${user.name.toLowerCase().trim()}` }).getOne();
    if (userDbName && userDbName.id != user.id)
        errors.push("Nom d'utilisateur exist déjà");
    return errors.length == 0 ? null : errors;
}
function queryAll() {
    return (0, utils_1.repo)(entities_1.UserEntity)
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.createdBy', 'createdBy')
        .leftJoinAndSelect('user.lastUpdateBy', 'lastUpdateBy')
        .select(['user.id', 'user.name', 'user.code', 'user.notes', 'user.createdAt', 'user.lastUpdateAt', 'createdBy', 'lastUpdateBy']);
}
//# sourceMappingURL=users.controller.js.map