import {
  ConflictException,
  Injectable,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';


import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    
  constructor(
    private readonly prisma: PrismaService,
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
  
}