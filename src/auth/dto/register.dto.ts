import { IsString, IsDateString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @IsString()
  firstName!: string;

  @ApiProperty()
  @IsString()
  lastName!: string;

  @ApiProperty({
    example: '0599999999',
  })
  @IsString()
  phone!: string;

  @ApiProperty({
    example: '1990-01-01',
  })
  @IsDateString()
  dateOfBirth!: string;

  @ApiProperty({
    example: 'password123',
    minLength: 6,
  })
  @MinLength(6)
  password!: string;
}