import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Shahd',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'shahd@test.com',
  })
  @IsEmail()
  email: string;
}