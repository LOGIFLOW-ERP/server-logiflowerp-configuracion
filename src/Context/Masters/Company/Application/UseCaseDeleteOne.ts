import { inject, injectable } from 'inversify'
import { ICompanyMongoRepository } from '../Domain'
import { COMPANY_TYPES } from '../Infrastructure/IoC'
import { ConflictException, ForbiddenException } from '@Config/exception'

@injectable()
export class UseCaseDeleteOne {

    constructor(
        @inject(COMPANY_TYPES.RepositoryMongo) private readonly repository: ICompanyMongoRepository,
    ) { }

    async exec(_id: string, companyCode: string) {

        const entity = await this.repository.select([{ $match: { _id } }])

        if (entity.length !== 1) {
            throw new ConflictException(`¡Hay ${entity.length} resultado(s) para empresa con _id ${_id}!`, true)
        }

        if (entity[0].code === companyCode) {
            throw new ForbiddenException(`¡No se puede eliminar la empresa ya que es propia!`, true)
        }

        return this.repository.deleteOne({ _id })
    }

}