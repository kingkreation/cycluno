import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ExecutionsService } from './executions.service';
import { ExecutionsController } from './executions.controller';
import { QueueModule } from '../common/queue/queue.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    QueueModule,
  ],
  controllers: [ExecutionsController],
  providers: [ExecutionsService],
})
export class ExecutionsModule {}