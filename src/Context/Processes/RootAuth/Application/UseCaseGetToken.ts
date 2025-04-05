import { AdapterToken } from '@Shared/Infrastructure'
import { ProfileENTITY, RootCompanyENTITY, TokenPayloadDTO, UserENTITY } from 'logiflowerp-sdk'

export class UseCaseGetToken {

    constructor(
        private readonly adapterToken: AdapterToken,
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
        return payload
    }

}