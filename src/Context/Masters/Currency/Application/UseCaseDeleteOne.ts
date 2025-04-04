import { inject, injectable } from 'inversify'
import { ICurrencyMongoRepository } from '../Domain'
import { CURRENCY_TYPES } from '../Infrastructure/IoC'

@injectable()
export class UseCaseDeleteOne {

    constructor(
        @inject(CURRENCY_TYPES.RepositoryMongo) private readonly repository: ICurrencyMongoRepository,
    ) { }

    async exec(_id: string) {
        return this.repository.deleteOne({ _id })
    }

}