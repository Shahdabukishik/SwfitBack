import {
  ConflictException,
  Injectable,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


import { LoginDto } from './dto/login.dto';

import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}



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
  
}