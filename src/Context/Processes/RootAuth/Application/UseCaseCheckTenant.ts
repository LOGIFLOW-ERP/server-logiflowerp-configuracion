import {
    AuthUserDTO,
    collections,
    db_root,
    RootCompanyENTITY,
    State,
} from 'logiflowerp-sdk'
import { injectable } from 'inversify'
import { MongoRepository } from '@Shared/Infrastructure'

@injectable()
export class UseCaseCheckTenant {
    async exec(tenant: string) {
        const rootCompany = await this.searchRootCompany(tenant)
        return !!rootCompany.length
    }

    private searchRootCompany(tenant: string) {
        const adapterMongoDB = new MongoRepository<RootCompanyENTITY>(db_root, collections.company, new AuthUserDTO())
        const pipeline = [{ $match: { code: tenant, state: State.ACTIVO, isDeleted: false } }]
        return adapterMongoDB.select(pipeline)
    }
}