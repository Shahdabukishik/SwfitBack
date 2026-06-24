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
}