import {
  BadRequestException,
  NotFoundException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { SmsService } from './services/sms.service';

import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';


import { LoginDto } from './dto/login.dto';

import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class AuthService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly smsService: SmsService,
  ) { }





  async register(dto: RegisterDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        phone: dto.phone,
      },
    });

    if (user) {
      throw new ConflictException(
        'Phone already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(
      dto.password,
      10,
    );

    const createdUser = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        dateOfBirth: new Date(dto.dateOfBirth),
        password: hashedPassword,
      },
    });

    console.log('DATABASE_URL =', process.env.DATABASE_URL);
    return {
      message: 'User created successfully',
      userId: createdUser.id,

    };

  }



  async login(loginDto: LoginDto) {
    const { phone, password } = loginDto;
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    console.log('JWT_SERVICE:', this.jwtService);

    const user = await this.prisma.user.findUnique({
      where: {
        phone,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid phone or password',
      );
    }

    const isPasswordValid =
      await bcrypt.compare(
        password,
        user.password,
      );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Invalid phone or password',
      );
    }

    const payload = {
      sub: user.id,
      phone: user.phone,
    };

    console.log(process.env.JWT_SECRET);
    const accessToken =
      await this.jwtService.signAsync(
        payload,
      );

    return {
      access_token: accessToken,
    };
  }


  private generateOtp(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }


  async forgotPassword(
    dto: ForgotPasswordDto,
  ) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          phone: dto.phone,
        },
      });

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    const otp = this.generateOtp();

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        otpCode: otp,
        otpExpiresAt: new Date(
          Date.now() + 5 * 60 * 1000,
        ),
      },
    });

    await this.smsService.sendOtp(
      user.phone,
      otp,
    );

    return {
      message: 'OTP sent successfully',
    };
  }



  async verifyOtp(
    dto: VerifyOtpDto,
  ) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          phone: dto.phone,
        },
      });

    if (!user) {
      throw new NotFoundException();
    }

    if (user.otpCode !== dto.otp) {
      throw new BadRequestException(
        'Invalid OTP',
      );
    }

    if (
      !user.otpExpiresAt ||
      user.otpExpiresAt < new Date()
    ) {
      throw new BadRequestException(
        'OTP expired',
      );
    }

    const resetToken =
      this.jwtService.sign({
        userId: user.id,
        purpose: 'reset-password',
      });

    return {
      resetToken,
    };
  }


  async resetPassword(
    dto: ResetPasswordDto,
  ) {
    const payload =
      this.jwtService.verify(
        dto.resetToken,
      );

    const hashedPassword =
      await bcrypt.hash(
        dto.newPassword,
        10,
      );

    await this.prisma.user.update({
      where: {
        id: payload.userId,
      },
      data: {
        password: hashedPassword,
        otpCode: null,
        otpExpiresAt: null,
      },
    });

    return {
      message:
        'Password reset successfully',
    };
  }

}