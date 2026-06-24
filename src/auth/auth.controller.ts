import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { LoginDto } from './dto/login.dto';
import { ApiBody } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 409, description: 'Phone exists' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
  @Post('login')
login(
  @Body() loginDto: LoginDto,
) {
  return this.authService.login(loginDto);
}

@Post('forgot-password')
forgotPassword(
  @Body()
  dto: ForgotPasswordDto,
) {
  return this.authService.forgotPassword(
    dto,
  );
}

@Post('verify-otp')
verifyOtp(
  @Body()
  dto: VerifyOtpDto,
) {
  return this.authService.verifyOtp(
    dto,
  );
}

@Post('reset-password')
resetPassword(
  @Body()
  dto: ResetPasswordDto,
) {
  return this.authService.resetPassword(
    dto,
  );
}

}