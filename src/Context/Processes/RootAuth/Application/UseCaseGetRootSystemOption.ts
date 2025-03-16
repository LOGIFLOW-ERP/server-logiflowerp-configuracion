import { ProfileENTITY, SystemOptionENTITY } from 'logiflowerp-sdk'
import { IRootSystemOptionMongoRepository } from '@Masters/RootSystemOption/Domain'

export class UseCaseGetRootSystemOption {

    constructor(
        private readonly repositorySystemOption: IRootSystemOptionMongoRepository,
    ) { }

    async exec(isSuperAdmin: boolean, profile?: ProfileENTITY) {
        const dataSystemOptions = await this.loadSystemOptions(isSuperAdmin, profile)
        const routes = this.getRoutes(dataSystemOptions)
        return { dataSystemOptions, routes }
    }

    private async loadSystemOptions(isSuperAdmin: boolean, profile?: ProfileENTITY) {

        if (isSuperAdmin) {
            const pipeline = [{ $match: { root: true } }]
            return this.repositorySystemOption.select(pipeline)
        }

        if (!profile) return []

        const pipeline = [{ $match: { _id: { $in: profile.systemOptions } } }]
        return this.repositorySystemOption.select(pipeline)
    }

    private getRoutes(dataSystemOptions: SystemOptionENTITY[]): string[] {
        return dataSystemOptions
            .map(el => el.route)
            .filter(route => route !== '')
    }

}