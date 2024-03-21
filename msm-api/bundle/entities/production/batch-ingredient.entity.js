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
exports.BatchIngredientEntity = void 0;
const typeorm_1 = require("typeorm");
const batch_entity_1 = require("./batch.entity");
const ingredient_entity_1 = require("./ingredient.entity");
let BatchIngredientEntity = class BatchIngredientEntity {
};
exports.BatchIngredientEntity = BatchIngredientEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BatchIngredientEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ingredient_entity_1.IngredientEntity, i => i.batchIngredients),
    (0, typeorm_1.JoinColumn)({ name: "ingredientId" }),
    __metadata("design:type", ingredient_entity_1.IngredientEntity)
], BatchIngredientEntity.prototype, "ingredientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'real' }),
    __metadata("design:type", Number)
], BatchIngredientEntity.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], BatchIngredientEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => batch_entity_1.BatchEntity, b => b.ingredients),
    (0, typeorm_1.JoinColumn)({ name: "batchId" }),
    __metadata("design:type", batch_entity_1.BatchEntity)
], BatchIngredientEntity.prototype, "batchId", void 0);
exports.BatchIngredientEntity = BatchIngredientEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'batch_ingredients' })
], BatchIngredientEntity);
//# sourceMappingURL=batch-ingredient.entity.js.map