import {
    AuthUserDTO,
    collections,
    db_root,
    ProfileENTITY,
    RootCompanyENTITY,
    SystemOptionENTITY
} from 'logiflowerp-sdk'
import { injectable } from 'inversify'
import { normalizePermissionName } from '@Shared/Infrastructure/Utils'
import { MongoRepository } from '@Shared/Infrastructure'

@injectable()
export class UseCaseGetRootSystemOption {
    private repositoryRootSystemOption = new MongoRepository<SystemOptionENTITY>(db_root, collections.systemOption, new AuthUserDTO())

    async exec(profile: ProfileENTITY) {
        const pipeline = [{ $match: { _id: { $in: profile.systemOptions } } }]
        const systemOptions = await this.repositoryRootSystemOption.select(pipeline)
        const _tags = this.getTags(systemOptions)
        return { systemOptions, _tags }
    }

    async execRoot(rootCompany: RootCompanyENTITY) {
        const pipeline = [{ $match: { _id: { $in: rootCompany.systemOptions } } }]
        const systemOptions = await this.repositoryRootSystemOption.select(pipeline)
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