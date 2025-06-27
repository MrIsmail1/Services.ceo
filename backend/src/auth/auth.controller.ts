import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Res,
} from '@nestjs/common';
import { Response } from 'express';
import { fifteenMinutesFromNow } from 'src/utils/date';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { PreAuthDto } from './dto/pre-auth.dto';
import { RegisterDto } from './dto/register.dto';
import {
    ApiTags,
    ApiOperation,
    ApiBody,
    ApiResponse,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: 'Check if an email is already registered' })
    @ApiBody({ type: PreAuthDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Pre-auth result',
        schema: {
            example: {
                exists: true,
                role: 'user',
                email: 'foo@bar.com',
            },
        },
    })
    @HttpCode(HttpStatus.OK)
    @Post('pre-auth')
    async preAuth(
        @Body() preAuthDto: PreAuthDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { exists, role, email } = await this.authService.preAuth(
            preAuthDto,
        );
        return { exists, role, email };
    }

    @ApiOperation({ summary: 'Log in and set accessToken cookie' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Logged in user',
        schema: {
            example: {
                user: {
                    id: 'uuid-1234',
                    email: 'foo@bar.com',
                    name: 'Foo Bar',
                },
            },
        },
    })
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { user, token } = await this.authService.login(loginDto);
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            expires: fifteenMinutesFromNow(),
        });
        return { user };
    }

    @ApiOperation({ summary: 'Register a new user and set accessToken cookie' })
    @ApiBody({ type: RegisterDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Registered user',
        schema: {
            example: {
                user: {
                    id: 'uuid-5678',
                    email: 'new@bar.com',
                    name: 'New User',
                },
            },
        },
    })
    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    async register(
        @Body() registerDto: RegisterDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { user, token } = await this.authService.register(registerDto);
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            expires: fifteenMinutesFromNow(),
        });
        return { user };
    }

    @ApiOperation({ summary: 'Log out and clear accessToken cookie' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully logged out',
    })
    @HttpCode(HttpStatus.OK)
    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
        });
        return { message: 'Successfully logged out' };
    }
}
