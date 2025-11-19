import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { FeaturesModule } from './features/features.module';
import { TestCasesModule } from './testcases/testcases.module';
import { ExecutionsModule } from './executions/executions.module';
import { BugsModule } from './bugs/bugs.module';
import { ReportsModule } from './reports/reports.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    FeaturesModule,
    TestCasesModule,
    ExecutionsModule,
    BugsModule,
    ReportsModule,
    AiModule,
  ],
})
export class AppModule {}