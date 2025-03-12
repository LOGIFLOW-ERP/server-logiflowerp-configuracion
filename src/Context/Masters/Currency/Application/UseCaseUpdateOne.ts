import { ICurrencyMongoRepository } from '../Domain'
import { UpdateCurrencyDTO } from 'logiflowerp-sdk'

export class UseCaseUpdateOne {

    constructor(
        private readonly repository: ICurrencyMongoRepository,
    ) { }

    async exec(_id: string, dto: UpdateCurrencyDTO) {
        return this.repository.updateOne({ _id }, { $set: dto })
    }

}