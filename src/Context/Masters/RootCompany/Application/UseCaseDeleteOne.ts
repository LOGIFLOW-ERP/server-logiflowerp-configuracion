import { inject, injectable } from 'inversify'
import { IRootCompanyMongoRepository } from '../Domain'
import { ROOT_COMPANY_TYPES } from '../Infrastructure/IoC'

@injectable()
export class UseCaseDeleteOne {

    constructor(
        @inject(ROOT_COMPANY_TYPES.RepositoryMongo) private readonly repository: IRootCompanyMongoRepository,
    ) { }

    async exec(_id: string) {
        return this.repository.deleteOne({ _id })
    }

}