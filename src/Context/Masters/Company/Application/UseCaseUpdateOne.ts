import { inject, injectable } from 'inversify'
import { ICompanyMongoRepository } from '../Domain'
import { UpdateCompanyDTO } from 'logiflowerp-sdk'
import { COMPANY_TYPES } from '../Infrastructure/IoC'

@injectable()
export class UseCaseUpdateOne {

    constructor(
        @inject(COMPANY_TYPES.RepositoryMongo) private readonly repository: ICompanyMongoRepository,
    ) { }

    exec(_id: string, dto: UpdateCompanyDTO) {
        return this.repository.updateOne({ _id }, { $set: dto })
    }

}