import { IRootCompanyMongoRepository } from '../Domain'
import { UpdateCompanyDTO } from 'logiflowerp-sdk'

export class UseCaseUpdateOne {

    constructor(
        private readonly repository: IRootCompanyMongoRepository,
    ) { }

    async exec(_id: string, dto: UpdateCompanyDTO) {
        return this.repository.updateOne({ _id }, { $set: dto })
    }

}