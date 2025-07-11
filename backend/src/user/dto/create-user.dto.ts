import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsEmail()
  email: string;
  @IsString()
  passwordHash: string;
  @IsString()
  role: 'PRO' | 'CLIENT';
}
