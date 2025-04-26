import { CompanyDTO, SignInDTO, State, UserENTITY, validateCustom } from 'logiflowerp-sdk'
import { IRootCompanyMongoRepository } from '@Masters/RootCompany/Domain'
import { UnprocessableEntityException } from '@Config/exception'
import { inject, injectable } from 'inversify'
import { ROOT_COMPANY_TYPES } from '@Masters/RootCompany/Infrastructure/IoC'

@injectable()
export class UseCaseGetRootCompany {

    constructor(
        @inject(ROOT_COMPANY_TYPES.RepositoryMongo) private readonly repository: IRootCompanyMongoRepository,
    ) { }

    async exec(user: UserENTITY, dto: SignInDTO) {
        const rootCompany = await this.searchRootCompany(dto)
        const isRoot = rootCompany.identityManager === user.identity
        const companyAuth = await validateCustom(rootCompany, CompanyDTO, UnprocessableEntityException)
        return { rootCompany, isRoot, companyAuth }
    }

    private searchRootCompany(dto: SignInDTO) {
        const pipeline = [{ $match: { code: dto.companyCode, state: State.ACTIVO } }]
        return this.repository.selectOne(pipeline)
    }

}