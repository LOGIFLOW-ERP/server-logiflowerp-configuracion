import { ConflictException, ForbiddenException, UnauthorizedException } from '@Config/exception'
import { env } from '@Config/env'
import { IProfileMongoRepository } from '@Masters/Profile/Domain'
import { AdapterToken } from '@Shared/Infrastructure'
import { ProfileENTITY, SignInDTO, SystemOptionENTITY, TokenPayloadDTO, UserENTITY } from 'logiflowerp-sdk'
import { IRootUserMongoRepository } from '@Masters/RootUser/Domain'
import { IRootSystemOptionMongoRepository } from '@Masters/RootSystemOption/Domain'

export class UseCaseSignIn {

    private isSuperAdmin = false

    constructor(
        private readonly repositoryUser: IRootUserMongoRepository,
        // private readonly repositoryProfile: IProfileMongoRepository,
        // private readonly repositorySystemOption: IRootSystemOptionMongoRepository,
        // private readonly adapterToken: AdapterToken,
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
        // const dataSystemOptions = await this.loadSystemOptions()
        // const routes = this.getRoutes(dataSystemOptions)
        // const payload = this.generatePayloadToken(user, routes, profile)
        // const token = await this.adapterToken.create(payload)
        // return { token, user: payload.user, dataSystemOptions, root: this.isSuperAdmin }
        return { user, root: this.isSuperAdmin }
    }

    // private generatePayloadToken(entity: UserENTITY, routes: string[], profile?: ProfileENTITY) {
    //     const payload = new TokenPayloadDTO()
    //     payload.user.set(entity)
    //     payload.routes = routes
    //     payload.root = this.isSuperAdmin
    //     if (profile) {
    //         payload.profile = profile
    //     }
    //     return payload
    // }

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

    // private async loadSystemOptions(profile?: ProfileENTITY) {
    //     if (!profile && !this.isSuperAdmin) return []

    //     const pipeline = profile ? [{ $match: { _id: { $in: profile.systemOptions } } }] : []

    //     return this.repositorySystemOption.select(pipeline)
    // }

    // private getRoutes(dataSystemOptions: SystemOptionENTITY[]): string[] {
    //     return dataSystemOptions
    //         .map(el => el.route)
    //         .filter(route => route !== '')
    // }

}