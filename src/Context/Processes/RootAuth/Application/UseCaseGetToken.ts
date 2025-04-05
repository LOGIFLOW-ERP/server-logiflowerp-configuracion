import { CONFIG_TYPES } from '@Config/types'
import { AdapterToken, SHARED_TYPES } from '@Shared/Infrastructure'
import { inject, injectable } from 'inversify'
import { ProfileENTITY, RootCompanyENTITY, TokenPayloadDTO, UserENTITY } from 'logiflowerp-sdk'

@injectable()
export class UseCaseGetToken {

    constructor(
        @inject(SHARED_TYPES.AdapterToken) private readonly adapterToken: AdapterToken,
        @inject(CONFIG_TYPES.Env) private readonly env: Env,
    ) { }

    async exec(user: UserENTITY, isSuperAdmin: boolean, routes: string[], profile?: ProfileENTITY, rootCompany?: RootCompanyENTITY) {
        const payload = this.generatePayloadToken(user, routes, isSuperAdmin, profile, rootCompany)
        const token = await this.adapterToken.create(payload)
        return { token, user: payload.user }
    }

    private generatePayloadToken(entity: UserENTITY, routes: string[], isSuperAdmin: boolean, profile?: ProfileENTITY, rootCompany?: RootCompanyENTITY) {
        const payload = new TokenPayloadDTO()
        payload.user.set(entity)
        payload.routes = routes
        payload.root = isSuperAdmin
        if (profile) {
            payload.profile.set(profile)
        }
        if (rootCompany) {
            payload.rootCompany.set(rootCompany)
        }
        if (isSuperAdmin) {
            payload.rootCompany.code = this.env.BD_ROOT
        }
        return payload
    }

}