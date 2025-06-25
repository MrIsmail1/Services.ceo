import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/auth/auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  providers: [UserService, AuthGuard, PrismaService, JwtService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
