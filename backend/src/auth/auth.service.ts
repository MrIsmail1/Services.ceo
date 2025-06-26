import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt-ts';
import {
  LoginPayload,
  PreAuthPayload,
  RegisterPayload,
  SignOptionsAndSecret,
} from 'src/types/auth';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  private tokenSigningOptions: SignOptionsAndSecret = {
    expiresIn: '4h',
    secret: process.env.JWT_SECRET!,
  };
  async preAuth({ email, role }: PreAuthPayload): Promise<{
    exists: boolean;
    role: string;
    email?: string;
  }> {
    const user = await this.userService.findByEmail(email);
    if (user && user.role === role) {
      return {
        exists: true,
        role: user.role,
        email: user.email,
      };
    } else if (user && user.role !== role) {
      throw new BadRequestException('USER_TYPE_MISMATCH');
    }
    return {
      exists: false,
      role: '',
      email: email,
    };
  }

  async register({
    firstName,
    lastName,
    email,
    password,
    role,
  }: RegisterPayload) {
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('EMAIL_IN_USE');
    }

    const passwordHash = await hash(password, 10);
    if (role !== 'PRO' && role !== 'CLIENT') {
      throw new BadRequestException('INVALID_USER_TYPE');
    }
    const user = await this.userService.create({
      firstName,
      lastName,
      email,
      passwordHash,
      role,
    });

    const token = await this.jwtService.signAsync(
      {
        userId: user.id,
        email: user.email,
      },
      this.tokenSigningOptions,
    );
    return {
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    };
  }
  async login({ email, password }: LoginPayload) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }
    const isPasswordValid = await compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }

    const token = await this.jwtService.signAsync(
      {
        userId: user.id,
        email: user.email,
      },
      this.tokenSigningOptions,
    );
    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}
