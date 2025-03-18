import { IPersonnelMongoRepository } from '../Domain'
import { UpdateCurrencyDTO } from 'logiflowerp-sdk'

export class UseCaseUpdateOne {

    constructor(
        private readonly repository: IPersonnelMongoRepository,
    ) { }

    async exec(_id: string, dto: UpdateCurrencyDTO) {
        return this.repository.updateOne({ _id }, { $set: dto })
    }

}