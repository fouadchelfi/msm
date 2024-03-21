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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const entities_1 = require("../../entities");
const utils_1 = require("../../utils");
const bcrypt = require("bcrypt");
let AuthController = class AuthController {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async signinLocal(body) {
        let user = await (0, utils_1.repo)(entities_1.UserEntity).createQueryBuilder('user').where("TRIM(LOWER(user.name)) = TRIM(LOWER(:name))", { name: body.name }).getOne();
        if (!user || !(await bcrypt.compare(body.password, user.password)))
            return { success: false, message: "Nom d'utilisateur ou mot de passe incorrect!" };
        return {
            data: {
                token: this.jwtService.sign({ id: user.id, name: user.name }, { secret: 'super-secret-cat', }),
            },
            success: true
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('local/login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signinLocal", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map