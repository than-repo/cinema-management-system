//src\admin\users\user.module.ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './user.service';
import { PrismaModule } from '../../sys/prisma/prisma.module';
import { GuardModule } from '../../shared/guards/guard.module';
import { TokenModule } from '../../sys/token/token.module';
import { UsersController } from './user.controller';
import { TokenCookieMiddleware } from '../../shared/middlewares/token-cookie.middleware';

@Module({
  imports: [PrismaModule, TokenModule, GuardModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
