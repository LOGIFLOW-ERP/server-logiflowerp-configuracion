import { ConflictException, ForbiddenException } from '@Config/exception'
import { SignInRootDTO, State, UserENTITY } from 'logiflowerp-sdk'
import { IRootUserMongoRepository } from '@Masters/RootUser/Domain'
import { CONFIG_TYPES } from '@Config/types'
import { inject, injectable } from 'inversify'
import { ROOT_USER_TYPES } from '@Masters/RootUser/Infrastructure/IoC'

@injectable()
export class UseCaseSignInRoot {

    constructor(
        @inject(ROOT_USER_TYPES.RepositoryMongo) private readonly repository: IRootUserMongoRepository,
        @inject(CONFIG_TYPES.Env) private readonly env: Env,
    ) { }

    async exec(dto: SignInRootDTO) {
        if (!this.env.ADMINISTRATOR_EMAILS.includes(dto.email)) {
            throw new ForbiddenException('Acceso denegado: este usuario no está autorizado como administrador', true)
        }
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

    private verifyPassword(dto: SignInRootDTO, user: UserENTITY) {
        const isValid = dto.password === user.password
        if (!isValid) {
            throw new ForbiddenException('Credenciales inválidas', true)
        }
    }

    private searchUser(email: string) {
        const pipeline = [{ $match: { email, state: State.ACTIVO } }]
        return this.repository.selectOne(pipeline)
    }

}