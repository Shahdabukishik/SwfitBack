import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {

    @ApiProperty({
        example: '0599999999',
    })
    @IsString()
    phone!: string;
}