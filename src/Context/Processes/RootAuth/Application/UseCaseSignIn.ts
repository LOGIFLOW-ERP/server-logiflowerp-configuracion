import { ConflictException, ForbiddenException } from '@Config/exception'
import { SignInDTO, State, UserENTITY } from 'logiflowerp-sdk'
import { IRootUserMongoRepository } from '@Masters/RootUser/Domain'
import { inject, injectable } from 'inversify'
import { ROOT_USER_TYPES } from '@Masters/RootUser/Infrastructure/IoC'

@injectable()
export class UseCaseSignIn {

    constructor(
        @inject(ROOT_USER_TYPES.RepositoryMongo) private readonly repository: IRootUserMongoRepository,
    ) { }

    async exec(dto: SignInDTO) {
        const user = await this.searchUser(dto.email)
        if (!user.state) {
            throw new ForbiddenException('El usuario está inactivo', true)
        }
        if (!user.emailVerified) {
            throw new ForbiddenException('Correo no verificado', true)
        }
        this.verifyPassword(dto, user)
        return { user }
    }

    private verifyPassword(dto: SignInDTO, user: UserENTITY) {
        const isValid = dto.password === user.password
        if (!isValid) {
            throw new ForbiddenException('Credenciales inválidas', true)
        }
    }

    private async searchUser(email: string) {
        const pipeline = [{ $match: { email, state: State.ACTIVO } }]
        const data = await this.repository.select(pipeline)
        if (!data.length) {
            throw new ForbiddenException('Credenciales inválidas', true)
        }
        if (data.length > 1) {
            throw new ConflictException(`Hay mas de un resultado para usuario con email ${email}.`)
        }
        return data[0]
    }

}