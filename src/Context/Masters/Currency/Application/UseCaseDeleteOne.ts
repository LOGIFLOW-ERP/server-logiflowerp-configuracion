import { ICurrencyMongoRepository } from '../Domain'

export class UseCaseDeleteOne {

    constructor(
        private readonly repository: ICurrencyMongoRepository,
    ) { }

    async exec(_id: string) {
        return this.repository.deleteOne({ _id })
    }

}