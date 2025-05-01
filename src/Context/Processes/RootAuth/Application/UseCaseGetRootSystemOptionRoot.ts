import { SystemOptionENTITY } from 'logiflowerp-sdk'
import { IRootSystemOptionMongoRepository } from '@Masters/RootSystemOption/Domain'
import { ROOT_SYSTEM_OPTION_TYPES } from '@Masters/RootSystemOption/Infrastructure/IoC'
import { inject, injectable } from 'inversify'
import { normalizePermissionName } from '@Shared/Infrastructure/Utils'

@injectable()
export class UseCaseGetRootSystemOptionRoot {

    constructor(
        @inject(ROOT_SYSTEM_OPTION_TYPES.RepositoryMongo) private readonly repository: IRootSystemOptionMongoRepository,
    ) { }

    async exec() {
        const dataSystemOptions = await this.loadSystemOptions()
        const _tags = this.getTags(dataSystemOptions)
        return { dataSystemOptions, _tags }
    }

    private async loadSystemOptions() {
        const pipeline = [{ $match: { root: true } }]
        return this.repository.select(pipeline)
    }

    private getTags(dataSystemOptions: SystemOptionENTITY[]): string[] {
        return dataSystemOptions
            .filter(e => e.route)
            .map(e => {
                return normalizePermissionName(e)
            })
    }

}