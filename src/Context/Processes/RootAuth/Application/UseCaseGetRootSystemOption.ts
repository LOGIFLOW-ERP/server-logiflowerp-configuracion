import { ProfileENTITY, RootCompanyENTITY, SystemOptionENTITY } from 'logiflowerp-sdk'
import { IRootSystemOptionMongoRepository } from '@Masters/RootSystemOption/Domain'

export class UseCaseGetRootSystemOption {

    constructor(
        private readonly repositorySystemOption: IRootSystemOptionMongoRepository
    ) { }

    async exec(profile: ProfileENTITY) {
        const pipeline = [{ $match: { _id: { $in: profile.systemOptions } } }]
        const systemOptions = await this.repositorySystemOption.select(pipeline)
        const routesAux = this.getRoutes(systemOptions)
        return { systemOptions, routesAux }
    }

    async execRoot(rootCompany: RootCompanyENTITY) {
        const pipeline = [{ $match: { _id: { $in: rootCompany.systemOptions } } }]
        const systemOptions = await this.repositorySystemOption.select(pipeline)
        const routesAux = this.getRoutes(systemOptions)
        return { systemOptions, routesAux }
    }

    private getRoutes(dataSystemOptions: SystemOptionENTITY[]): string[] {
        return dataSystemOptions
            .map(el => el.route)
            .filter(route => route !== '')
    }

}