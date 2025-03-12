import { ConflictException, ForbiddenException, UnauthorizedException } from '@Config/exception'
import { env } from '@Config/env'
import { IProfileMongoRepository } from '@Masters/Profile/Domain'
import { PROFILE_TYPES } from '@Masters/Profile/Infrastructure/IoC'
import { ISystemOptionMongoRepository } from '@Masters/RootSystemOption/Domain'
import { SYSTEM_OPTION_TYPES } from '@Masters/RootSystemOption/Infrastructure/IoC'
import { IUserMongoRepository } from '@Masters/User/Domain'
import { USER_TYPES } from '@Masters/User/Infrastructure'
import { AdapterToken, SHARED_TYPES } from '@Shared/Infrastructure'
import { inject, injectable } from 'inversify'
import { ProfileENTITY, SignInDTO, SystemOptionENTITY, TokenPayloadDTO, UserENTITY } from 'logiflowerp-sdk'

@injectable()
export class UseCaseSignIn {

    private isSuperAdmin = false

    constructor(
        @inject(USER_TYPES.MongoRepository) private readonly repositoryUser: IUserMongoRepository,
        @inject(PROFILE_TYPES.MongoRepository) private readonly repositoryProfile: IProfileMongoRepository,
        @inject(SYSTEM_OPTION_TYPES.MongoRepository) private readonly repositorySystemOption: ISystemOptionMongoRepository,
        @inject(SHARED_TYPES.AdapterToken) private readonly adapterToken: AdapterToken,
    ) { }

    async exec(dto: SignInDTO) {
        const user = await this.searchUser(dto.email)
        if (!user.state) {
            throw new ForbiddenException('El usuario está inactivo.', true)
        }
        if (!user.emailVerified) {
            throw new UnauthorizedException('Correo no verificado.', true)
        }
        this.verifyPassword(dto, user)
        this.isSuperAdmin = env.ADMINISTRATOR_EMAILS.includes(user.email)
        const profile = await this.loadProfile(user)
        const dataSystemOptions = await this.loadSystemOptions()
        const routes = this.getRoutes(dataSystemOptions)
        const payload = this.generatePayloadToken(user, routes, profile)
        const token = await this.adapterToken.create(payload)
        return { token, user: payload.user, dataSystemOptions, root: this.isSuperAdmin }
    }

    private generatePayloadToken(entity: UserENTITY, routes: string[], profile?: ProfileENTITY) {
        const payload = new TokenPayloadDTO()
        payload.user.set(entity)
        payload.routes = routes
        payload.root = this.isSuperAdmin
        if (profile) {
            payload.profile = profile
        }
        return payload
    }

    private verifyPassword(dto: SignInDTO, user: UserENTITY) {
        // const isValid = await this.hashService.compare(password, user.password)
        // if (!isValid) throw new AuthError('Credenciales inválidas')
        const isValid = dto.password === user.password
        if (!isValid) {
            throw new UnauthorizedException('Credenciales inválidas.', true)
        }
    }

    private async searchUser(email: string) {
        const pipeline = [{ $match: { email } }]
        const data = await this.repositoryUser.select(pipeline)
        if (!data.length) {
            throw new UnauthorizedException('Credenciales inválidas.', true)
        }
        if (data.length > 1) {
            throw new ConflictException(`Hay mas de un resultado para usuario con email ${email}.`)
        }
        return data[0]
    }

    private async loadProfile(user: UserENTITY) {
        if (!user._idprofile || this.isSuperAdmin) return
        const pipeline = [{ $match: { _id: user._idprofile } }]
        const profile = await this.repositoryProfile.select(pipeline)
        if (profile.length !== 1) {
            throw new ConflictException(`Error al buscar perfil. Hay ${profile.length} resultados para ${JSON.stringify(pipeline)}`)
        }
        return profile[0]
    }

    private async loadSystemOptions(profile?: ProfileENTITY) {
        if (!profile && !this.isSuperAdmin) return []

        const pipeline = profile ? [{ $match: { _id: { $in: profile.systemOptions } } }] : []

        return this.repositorySystemOption.select(pipeline)
    }

    private getRoutes(dataSystemOptions: SystemOptionENTITY[]): string[] {
        return dataSystemOptions
            .map(el => el.route)
            .filter(route => route !== '')
    }

}