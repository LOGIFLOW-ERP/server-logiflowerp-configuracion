import { ProfileENTITY, RootCompanyENTITY, SystemOptionENTITY } from 'logiflowerp-sdk'
import { IRootSystemOptionMongoRepository } from '@Masters/RootSystemOption/Domain'
import { inject, injectable } from 'inversify'
import { ROOT_SYSTEM_OPTION_TYPES } from '@Masters/RootSystemOption/Infrastructure/IoC'
import { normalizePermissionName } from '@Shared/Infrastructure/Utils'

@injectable()
export class UseCaseGetRootSystemOption {

    constructor(
        @inject(ROOT_SYSTEM_OPTION_TYPES.RepositoryMongo) private readonly repository: IRootSystemOptionMongoRepository
    ) { }

    async exec(profile: ProfileENTITY) {
        const pipeline = [{ $match: { _id: { $in: profile.systemOptions } } }]
        const systemOptions = await this.repository.select(pipeline)
        const _tags = this.getTags(systemOptions)
        return { systemOptions, _tags }
    }

    async execRoot(rootCompany: RootCompanyENTITY) {
        const pipeline = [{ $match: { _id: { $in: rootCompany.systemOptions } } }]
        const systemOptions = await this.repository.select(pipeline)
        const _tags = this.getTags(systemOptions)
        return { systemOptions, _tags }
    }

    private getTags(dataSystemOptions: SystemOptionENTITY[]): string[] {
        return dataSystemOptions
            .filter(e => e.route)
            .map(e => {
                return normalizePermissionName(e)
            })
    }

}