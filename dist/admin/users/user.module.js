"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
//src\admin\users\user.module.ts
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const prisma_module_1 = require("../../sys/prisma/prisma.module");
const guard_module_1 = require("../../shared/guards/guard.module");
const token_module_1 = require("../../sys/token/token.module");
const user_controller_1 = require("./user.controller");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, token_module_1.TokenModule, guard_module_1.GuardModule],
        controllers: [user_controller_1.UsersController],
        providers: [user_service_1.UsersService],
        exports: [user_service_1.UsersService],
    })
], UsersModule);
//# sourceMappingURL=user.module.js.map