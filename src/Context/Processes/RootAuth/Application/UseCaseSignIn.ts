import { ConflictException, ForbiddenException } from '@Config/exception'
import { AuthUserDTO, collections, SignInDTO, State, UserENTITY } from 'logiflowerp-sdk'
import { inject, injectable } from 'inversify'
import { AdapterEncryption, MongoRepository, SHARED_TYPES } from '@Shared/Infrastructure'
import { CONFIG_TYPES } from '@Config/types'

@injectable()
export class UseCaseSignIn {
    constructor(
        @inject(SHARED_TYPES.AdapterEncryption) private readonly adapterEncryption: AdapterEncryption,
        @inject(CONFIG_TYPES.Env) private readonly env: Env,
    ) { }

    async exec(dto: SignInDTO, tenant: string) {
        const user = await this.searchUser(dto.email, tenant)
        if (!user.state) {
            throw new ForbiddenException('El usuario está inactivo', true)
        }
        if (!user.emailVerified) {
            throw new ForbiddenException('Correo no verificado', true)
        }
        await this.verifyPassword(dto, user)
        const isRoot = this.env.DEVELOPERS_MAILS.includes(user.email)
        return { user, isRoot }
    }

    private async verifyPassword(dto: SignInDTO, user: UserENTITY) {
        const isValid = await this.adapterEncryption.verifyPassword(dto.password, user.password)
        if (!isValid) {
            throw new ForbiddenException('Credenciales inválidas', true)
        }
    }

    private async searchUser(email: string, tenant: string) {
        const pipeline = [{ $match: { email, state: State.ACTIVO, isDeleted: false } }]
        const repository = new MongoRepository<UserENTITY>(tenant, collections.user, new AuthUserDTO())
        const data = await repository.select(pipeline)
        if (!data.length) {
            throw new ForbiddenException('Credenciales inválidas', true)
        }
        if (data.length > 1) {
            throw new ConflictException(`Se encontraron múltiples usuarios con email ${email}.`)
        }
        return data[0]
    }

}