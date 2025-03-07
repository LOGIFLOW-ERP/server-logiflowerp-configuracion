import { inject, injectable } from 'inversify'
import { COMPANY_TYPES } from '../Infrastructure/IoC'
import { ICompanyMongoRepository } from '../Domain'
import { UpdateCompanyDTO } from 'logiflowerp-sdk'

@injectable()
export class UseCaseUpdateOne {

    constructor(
        @inject(COMPANY_TYPES.MongoRepository) private readonly repository: ICompanyMongoRepository,
    ) { }

    async exec(_id: string, dto: UpdateCompanyDTO) {
        return this.repository.updateOne({ _id }, { $set: dto })
    }

}