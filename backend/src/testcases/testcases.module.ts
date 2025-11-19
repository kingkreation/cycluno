import { Module } from '@nestjs/common';
import { TestCasesService } from './testcases.service';
import { TestCasesController } from './testcases.controller';

@Module({
  controllers: [TestCasesController],
  providers: [TestCasesService],
})
export class TestCasesModule {}