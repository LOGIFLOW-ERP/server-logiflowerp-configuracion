import { inject, injectable } from 'inversify'
import { ICompanyMongoRepository } from '../Domain'
import { UpdateCompanyDTO } from 'logiflowerp-sdk'
import { COMPANY_TYPES } from '../Infrastructure/IoC'
import { ForbiddenException } from '@Config/exception'

@injectable()
export class UseCaseUpdateOne {

    constructor(
        @inject(COMPANY_TYPES.RepositoryMongo) private readonly repository: ICompanyMongoRepository,
    ) { }

    async exec(_id: string, dto: UpdateCompanyDTO, companyCode: string) {

        const entity = await this.repository.selectOne([{ $match: { _id } }])

        if (entity.code === companyCode) {
            throw new ForbiddenException(`¡No se puede actualizar la empresa ya que es propia!`, true)
        }

        return this.repository.updateOne({ _id }, { $set: dto })
    }

}