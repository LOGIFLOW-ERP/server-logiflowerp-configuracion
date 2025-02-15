import { IsNotEmpty, IsString } from 'class-validator'

export class IRENIECPersonalData {
    @IsString()
    @IsNotEmpty()
    nombres: string = ''

    @IsString()
    @IsNotEmpty()
    apellidoPaterno: string = ''

    @IsString()
    @IsNotEmpty()
    apellidoMaterno: string = ''

    @IsString()
    @IsNotEmpty()
    tipoDocumento: string = ''

    @IsString()
    @IsNotEmpty()
    numeroDocumento: string = ''

    @IsString()
    @IsNotEmpty()
    digitoVerificador: string = ''
}