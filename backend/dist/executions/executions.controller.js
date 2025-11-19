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
exports.ExecutionsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const executions_service_1 = require("./executions.service");
const dto_1 = require("./dto");
let ExecutionsController = class ExecutionsController {
    constructor(executionsService) {
        this.executionsService = executionsService;
    }
    async create(dto, user) {
        return this.executionsService.create(dto, user.id);
    }
    async findOne(id, user) {
        return this.executionsService.findOne(id, user.id);
    }
    async updateCase(executionId, caseId, dto, user) {
        return this.executionsService.updateCase(executionId, caseId, dto, user.id);
    }
    async uploadEvidence(executionId, executionCaseId, file, user) {
        return this.executionsService.uploadEvidence(executionId, executionCaseId, file, user.id);
    }
};
exports.ExecutionsController = ExecutionsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateExecutionDto, Object]),
    __metadata("design:returntype", Promise)
], ExecutionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ExecutionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/case/:caseId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('caseId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dto_1.UpdateExecutionCaseDto, Object]),
    __metadata("design:returntype", Promise)
], ExecutionsController.prototype, "updateCase", null);
__decorate([
    (0, common_1.Post)(':id/upload-evidence'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('executionCaseId')),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], ExecutionsController.prototype, "uploadEvidence", null);
exports.ExecutionsController = ExecutionsController = __decorate([
    (0, swagger_1.ApiTags)('Executions'),
    (0, common_1.Controller)('executions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [executions_service_1.ExecutionsService])
], ExecutionsController);
//# sourceMappingURL=executions.controller.js.map