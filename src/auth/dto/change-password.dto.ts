import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';



export class ChangePasswordDto {
  @IsString()
  @ApiProperty()
  currentPassword!: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  newPassword!: string;
}