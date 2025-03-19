import { ConflictException, ForbiddenException, UnauthorizedException } from '@Config/exception'
import { SignInDTO, UserENTITY } from 'logiflowerp-sdk'
import { IRootUserMongoRepository } from '@Masters/RootUser/Domain'

export class UseCaseSignIn {

    constructor(
        private readonly repositoryUser: IRootUserMongoRepository,
    ) { }

    async exec(dto: SignInDTO) {
        const user = await this.searchUser(dto.email)
        if (!user.state) {
            throw new ForbiddenException('El usuario está inactivo', true)
        }
        if (!user.emailVerified) {
            throw new UnauthorizedException('Correo no verificado', true)
        }
        this.verifyPassword(dto, user)
        return { user }
    }

    private verifyPassword(dto: SignInDTO, user: UserENTITY) {
        const isValid = dto.password === user.password
        if (!isValid) {
            throw new UnauthorizedException('Credenciales inválidas', true)
        }
    }

    private async searchUser(email: string) {
        const pipeline = [{ $match: { email } }]
        const data = await this.repositoryUser.select(pipeline)
        if (!data.length) {
            throw new UnauthorizedException('Credenciales inválidas', true)
        }
        if (data.length > 1) {
            throw new ConflictException(`Hay mas de un resultado para usuario con email ${email}.`)
        }
        return data[0]
    }

}