import { SignInDTO, State, UserENTITY } from 'logiflowerp-sdk'
import { IRootCompanyMongoRepository } from '@Masters/RootCompany/Domain'
import { ConflictException } from '@Config/exception'

export class UseCaseGetRootCompany {

    constructor(
        private readonly repositoryRootCompany: IRootCompanyMongoRepository,
    ) { }

    async exec(user: UserENTITY, dto: SignInDTO) {
        const rootCompany = await this.searchRootCompany(dto)
        const isRoot = rootCompany.identityManager === user.identity
        return { rootCompany, isRoot }
    }

    private async searchRootCompany(dto: SignInDTO) {
        const pipeline = [{ $match: { code: dto.companyCode, state: State.ACTIVO } }]
        const rootCompany = await this.repositoryRootCompany.select(pipeline)
        if (rootCompany.length !== 1) {
            throw new ConflictException(`Error al buscar empresa root. Hay ${rootCompany.length} resultados para ${JSON.stringify(pipeline)}`)
        }
        return rootCompany[0]
    }

}