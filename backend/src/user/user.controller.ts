import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from 'src/types/auth';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request & { user: JwtPayload }) {
    const user = await this.userService.findById(req.user.userId);
    if (!user) {
      return null;
    }
    const { passwordHash, ...result } = user;
    return result;
  }
}
