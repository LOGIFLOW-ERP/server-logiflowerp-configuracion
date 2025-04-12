import { ProfileENTITY, RootCompanyENTITY, SystemOptionENTITY } from 'logiflowerp-sdk'
import { IRootSystemOptionMongoRepository } from '@Masters/RootSystemOption/Domain'
import { inject, injectable } from 'inversify'
import { ROOT_SYSTEM_OPTION_TYPES } from '@Masters/RootSystemOption/Infrastructure/IoC'

@injectable()
export class UseCaseGetRootSystemOption {

    constructor(
        @inject(ROOT_SYSTEM_OPTION_TYPES.RepositoryMongo) private readonly repository: IRootSystemOptionMongoRepository
    ) { }

    async exec(profile: ProfileENTITY) {
        const pipeline = [{ $match: { _id: { $in: profile.systemOptions } } }]
        const systemOptions = await this.repository.select(pipeline)
        const routesAux = this.getRoutes(systemOptions)
        return { systemOptions, routesAux }
    }

    async execRoot(rootCompany: RootCompanyENTITY) {
        const pipeline = [{ $match: { _id: { $in: rootCompany.systemOptions } } }]
        const systemOptions = await this.repository.select(pipeline)
        const routesAux = this.getRoutes(systemOptions)
        return { systemOptions, routesAux }
    }

    private getRoutes(dataSystemOptions: SystemOptionENTITY[]): string[] {
        return dataSystemOptions
            .map(el => el.route)
            .filter(route => route !== '')
    }

}