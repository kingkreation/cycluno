import { Controller, Get, Post, Patch, Body, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ExecutionsService } from './executions.service';
import { CreateExecutionDto, UpdateExecutionCaseDto } from './dto';

@ApiTags('Executions')
@Controller('executions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExecutionsController {
  constructor(private executionsService: ExecutionsService) {}

  @Post()
  async create(@Body() dto: CreateExecutionDto, @CurrentUser() user: any) {
    return this.executionsService.create(dto, user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.executionsService.findOne(id, user.id);
  }

  @Patch(':id/case/:caseId')
  async updateCase(
    @Param('id') executionId: string,
    @Param('caseId') caseId: string,
    @Body() dto: UpdateExecutionCaseDto,
    @CurrentUser() user: any,
  ) {
    return this.executionsService.updateCase(executionId, caseId, dto, user.id);
  }

  @Post(':id/upload-evidence')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async uploadEvidence(
    @Param('id') executionId: string,
    @Body('executionCaseId') executionCaseId: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    return this.executionsService.uploadEvidence(executionId, executionCaseId, file, user.id);
  }
}