import { ICompanyMongoRepository } from '../Domain'
import { UpdateCompanyDTO } from 'logiflowerp-sdk'

export class UseCaseUpdateOne {

    constructor(
        private readonly repository: ICompanyMongoRepository,
    ) { }

    async exec(_id: string, dto: UpdateCompanyDTO) {
        return this.repository.updateOne({ _id }, { $set: dto })
    }

}