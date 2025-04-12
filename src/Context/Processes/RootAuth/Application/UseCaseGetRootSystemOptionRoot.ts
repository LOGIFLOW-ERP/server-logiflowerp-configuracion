import { SystemOptionENTITY } from 'logiflowerp-sdk'
import { IRootSystemOptionMongoRepository } from '@Masters/RootSystemOption/Domain'
import { ROOT_SYSTEM_OPTION_TYPES } from '@Masters/RootSystemOption/Infrastructure/IoC'
import { inject, injectable } from 'inversify'

@injectable()
export class UseCaseGetRootSystemOptionRoot {

    constructor(
        @inject(ROOT_SYSTEM_OPTION_TYPES.RepositoryMongo) private readonly repository: IRootSystemOptionMongoRepository,
    ) { }

    async exec() {
        const dataSystemOptions = await this.loadSystemOptions()
        const routes = this.getRoutes(dataSystemOptions)
        return { dataSystemOptions, routes }
    }

    private async loadSystemOptions() {
        const pipeline = [{ $match: { root: true } }]
        return this.repository.select(pipeline)
    }

    private getRoutes(dataSystemOptions: SystemOptionENTITY[]): string[] {
        return dataSystemOptions
            .map(el => el.route)
            .filter(route => route !== '')
    }

}