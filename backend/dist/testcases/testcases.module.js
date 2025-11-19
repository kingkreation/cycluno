"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestCasesModule = void 0;
const common_1 = require("@nestjs/common");
const testcases_service_1 = require("./testcases.service");
const testcases_controller_1 = require("./testcases.controller");
let TestCasesModule = class TestCasesModule {
};
exports.TestCasesModule = TestCasesModule;
exports.TestCasesModule = TestCasesModule = __decorate([
    (0, common_1.Module)({
        controllers: [testcases_controller_1.TestCasesController],
        providers: [testcases_service_1.TestCasesService],
    })
], TestCasesModule);
//# sourceMappingURL=testcases.module.js.map