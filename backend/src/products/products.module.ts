import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { QueueModule } from '../common/queue/queue.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    QueueModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}