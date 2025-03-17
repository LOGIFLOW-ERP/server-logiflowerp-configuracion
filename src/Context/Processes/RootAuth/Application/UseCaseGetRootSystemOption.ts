import { ProfileENTITY, SystemOptionENTITY, UserENTITY } from 'logiflowerp-sdk'
import { IRootSystemOptionMongoRepository } from '@Masters/RootSystemOption/Domain'
import { IRootCompanyMongoRepository } from '@Masters/RootCompany/Domain'
import { ConflictException } from '@Config/exception'

export class UseCaseGetRootSystemOption {

    constructor(
        private readonly repositorySystemOption: IRootSystemOptionMongoRepository,
        private readonly repositoryRootCompany: IRootCompanyMongoRepository,
    ) { }

    async exec(user: UserENTITY, isSuperAdmin: boolean, profile?: ProfileENTITY) {
        const dataSystemOptions = await this.loadSystemOptions(user, isSuperAdmin, profile)
        const routes = this.getRoutes(dataSystemOptions)
        return { dataSystemOptions, routes }
    }

    private async loadSystemOptions(user: UserENTITY, isSuperAdmin: boolean, profile?: ProfileENTITY) {
        if (isSuperAdmin) {
            const pipeline = [{ $match: { root: true } }]
            return this.repositorySystemOption.select(pipeline)
        }

        if (!profile && !user.root) return []

        const rootCompany = await this.searchRootCompany(user)

        const rootOptions = Array.isArray(rootCompany.systemOptions) ? rootCompany.systemOptions : []
        const profileOptions = Array.isArray(profile?.systemOptions) ? profile.systemOptions : []

        const rootOptionsSet = new Set(rootOptions.map(opt => opt.toString()))

        const _ids = user.root
            ? rootOptions
            : profileOptions.filter(id => rootOptionsSet.has(id.toString()))

        const pipeline = [{ $match: { _id: { $in: _ids } } }]
        return this.repositorySystemOption.select(pipeline)
    }

    private async searchRootCompany(user: UserENTITY) {
        const pipeline = [{ $match: { code: user.company.code } }]
        const rootCompany = await this.repositoryRootCompany.select(pipeline)
        if (rootCompany.length !== 1) {
            throw new ConflictException(`Error al buscar empresa root. Hay ${rootCompany.length} resultados para ${JSON.stringify(pipeline)}`)
        }
        return rootCompany[0]
    }

    private getRoutes(dataSystemOptions: SystemOptionENTITY[]): string[] {
        return dataSystemOptions
            .map(el => el.route)
            .filter(route => route !== '')
    }

}