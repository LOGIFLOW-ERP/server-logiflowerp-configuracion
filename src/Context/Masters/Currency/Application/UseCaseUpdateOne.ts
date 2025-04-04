import { ICurrencyMongoRepository } from '../Domain'
import { UpdateCurrencyDTO } from 'logiflowerp-sdk'
import { inject, injectable } from 'inversify'
import { CURRENCY_TYPES } from '../Infrastructure/IoC'

@injectable()
export class UseCaseUpdateOne {

    constructor(
        @inject(CURRENCY_TYPES.RepositoryMongo) private readonly repository: ICurrencyMongoRepository,
    ) { }

    async exec(_id: string, dto: UpdateCurrencyDTO) {
        return this.repository.updateOne({ _id }, { $set: dto })
    }

}