import { AdapterToken, SHARED_TYPES } from '@Shared/Infrastructure'
import { inject, injectable } from 'inversify'
import { EmployeeAuthDTO, ProfileENTITY, RootCompanyENTITY, TokenPayloadDTO, UserENTITY } from 'logiflowerp-sdk'

@injectable()
export class UseCaseGetToken {

    constructor(
        @inject(SHARED_TYPES.AdapterToken) private readonly adapterToken: AdapterToken,
    ) { }

    async exec(user: UserENTITY, profile?: ProfileENTITY, rootCompany?: RootCompanyENTITY, personnel?: EmployeeAuthDTO) {
        const payload = this.generatePayloadToken(user, profile, rootCompany, personnel)
        const token = await this.adapterToken.create(payload, undefined, 43200) // const expiresIn = 12 * 60 * 60; // = 43200 o '12h'
        return { token, user: payload.user }
    }

    private generatePayloadToken(entity: UserENTITY, profile?: ProfileENTITY, rootCompany?: RootCompanyENTITY, personnel?: EmployeeAuthDTO) {
        const payload = new TokenPayloadDTO()
        payload.user.set(entity)
        if (profile) {
            payload.profile.set(profile)
        }
        if (rootCompany) {
            payload.rootCompany.set(rootCompany)
        }
        // if (isSuperAdmin) {
        //     payload.rootCompany.code = this.env.DB_ROOT
        // }
        if (personnel) {
            payload.personnel.set(personnel)
        }
        return payload
    }

}