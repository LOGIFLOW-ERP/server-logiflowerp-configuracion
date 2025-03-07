import { inject, injectable } from 'inversify'
import { COMPANY_TYPES } from '../Infrastructure/IoC'
import { ICompanyMongoRepository } from '../Domain'
@injectable()
export class UseCaseDeleteOne {

    constructor(
        @inject(COMPANY_TYPES.MongoRepository) private readonly repository: ICompanyMongoRepository,
    ) { }

    async exec(_id: string) {
        return this.repository.deleteOne({ _id })
    }

}