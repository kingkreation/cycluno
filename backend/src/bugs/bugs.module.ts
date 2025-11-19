import { Module } from '@nestjs/common';
import { BugsService } from './bugs.service';
import { BugsController } from './bugs.controller';

@Module({
  controllers: [BugsController],
  providers: [BugsService],
})
export class BugsModule {}