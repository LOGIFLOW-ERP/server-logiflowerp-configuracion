import { inject, injectable } from 'inversify'
import { CURRENCY_TYPES } from '../Infrastructure/IoC'
import { ICurrencyMongoRepository } from '../Domain'
@injectable()
export class UseCaseDeleteOne {

    constructor(
        @inject(CURRENCY_TYPES.MongoRepository) private readonly repository: ICurrencyMongoRepository,
    ) { }

    async exec(_id: string) {
        return this.repository.deleteOne({ _id })
    }

}