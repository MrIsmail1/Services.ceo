import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class PreAuthDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User role',
    enum: ['PRO', 'CLIENT'],
    example: 'PRO',
  })
  @IsString()
  role: 'PRO' | 'CLIENT';
}
