import { SystemOptionENTITY } from 'logiflowerp-sdk'
import { IRootSystemOptionMongoRepository } from '@Masters/RootSystemOption/Domain'
export class UseCaseGetRootSystemOptionRoot {

    constructor(
        private readonly repositorySystemOption: IRootSystemOptionMongoRepository,
    ) { }

    async exec() {
        const dataSystemOptions = await this.loadSystemOptions()
        const routes = this.getRoutes(dataSystemOptions)
        return { dataSystemOptions, routes }
    }

    private async loadSystemOptions() {
        const pipeline = [{ $match: { root: true } }]
        return this.repositorySystemOption.select(pipeline)
    }

    private getRoutes(dataSystemOptions: SystemOptionENTITY[]): string[] {
        return dataSystemOptions
            .map(el => el.route)
            .filter(route => route !== '')
    }

}