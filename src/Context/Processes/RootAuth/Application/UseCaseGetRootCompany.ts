import {
    AuthUserDTO,
    collections,
    CompanyDTO,
    db_root,
    RootCompanyENTITY,
    State,
    UserENTITY,
    validateCustom
} from 'logiflowerp-sdk'
import { UnprocessableEntityException } from '@Config/exception'
import { injectable } from 'inversify'
import { MongoRepository } from '@Shared/Infrastructure'

@injectable()
export class UseCaseGetRootCompany {
    async exec(user: UserENTITY, tenant: string) {
        const rootCompany = await this.searchRootCompany(tenant)
        const isRoot = rootCompany.identityManager === user.identity
        const companyAuth = await validateCustom(rootCompany, CompanyDTO, UnprocessableEntityException)
        return { rootCompany, isRoot, companyAuth }
    }

    private searchRootCompany(tenant: string) {
        const adapterMongoDB = new MongoRepository<RootCompanyENTITY>(db_root, collections.company, new AuthUserDTO())
        const pipeline = [{ $match: { code: tenant, state: State.ACTIVO, isDeleted: false } }]
        return adapterMongoDB.selectOne(pipeline)
    }
}