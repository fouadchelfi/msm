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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const db_1 = require("./db");
let AppController = class AppController {
    constructor(dbSchema) {
        this.dbSchema = dbSchema;
    }
    async checkAtStartup() {
        await this.dbSchema.checkDb();
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('check-at-startup'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "checkAtStartup", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)('app'),
    __metadata("design:paramtypes", [db_1.DbService])
], AppController);
//# sourceMappingURL=app.controller.js.map