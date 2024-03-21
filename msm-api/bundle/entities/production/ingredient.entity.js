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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngredientEntity = void 0;
const typeorm_1 = require("typeorm");
const settings_1 = require("../settings");
const batch_ingredient_entity_1 = require("./batch-ingredient.entity");
let IngredientEntity = class IngredientEntity {
};
exports.IngredientEntity = IngredientEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], IngredientEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], IngredientEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], IngredientEntity.prototype, "label", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], IngredientEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ update: false }),
    __metadata("design:type", Date)
], IngredientEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => settings_1.UserEntity, user => user.createdIngredients),
    (0, typeorm_1.JoinColumn)({ name: "createdBy" }),
    __metadata("design:type", settings_1.UserEntity)
], IngredientEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], IngredientEntity.prototype, "lastUpdateAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => settings_1.UserEntity, user => user.updatedIngredients),
    (0, typeorm_1.JoinColumn)({ name: "lastUpdateBy" }),
    __metadata("design:type", settings_1.UserEntity)
], IngredientEntity.prototype, "lastUpdateBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => batch_ingredient_entity_1.BatchIngredientEntity, b => b.ingredientId),
    __metadata("design:type", Array)
], IngredientEntity.prototype, "batchIngredients", void 0);
exports.IngredientEntity = IngredientEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'ingredients' })
], IngredientEntity);
//# sourceMappingURL=ingredient.entity.js.map