import { Expose } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

export class DataResetPasswordDTO {
    @IsString()
    @MinLength(50)
    @Expose()
    token: string = ''

    @IsString()
    @MinLength(8)
    @Expose()
    newPassword: string = ''
}