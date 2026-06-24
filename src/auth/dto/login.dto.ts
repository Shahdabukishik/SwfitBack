import {
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: '0592325651',
  })
  @IsString()
  phone!: string;

  @ApiProperty({
    example: '123456789',
  })
  @IsString()
  @MinLength(6)
  password!: string;
}

