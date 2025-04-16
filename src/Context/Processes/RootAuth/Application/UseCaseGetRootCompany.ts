import { CompanyDTO, SignInDTO, State, UserENTITY, validateCustom } from 'logiflowerp-sdk'
import { IRootCompanyMongoRepository } from '@Masters/RootCompany/Domain'
import { ConflictException, UnprocessableEntityException } from '@Config/exception'
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

    private async searchRootCompany(dto: SignInDTO) {
        const pipeline = [{ $match: { code: dto.companyCode, state: State.ACTIVO } }]
        const rootCompany = await this.repository.select(pipeline)
        if (rootCompany.length !== 1) {
            throw new ConflictException(`Error al buscar empresa root. Hay ${rootCompany.length} resultados para ${JSON.stringify(pipeline)}`)
        }
        return rootCompany[0]
    }

}