import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class VerifyOtpDto {
  @ApiProperty({
    example: '0599999999',
  })
  phone!: string;

  @ApiProperty({
    example: 1234,
  })
  @Type(() => Number)
  @IsInt()
  otp!: number;
}