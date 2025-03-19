import { IPersonnelMongoRepository } from '../Domain'
import { UpdateEmployeeDTO } from 'logiflowerp-sdk'

export class UseCaseUpdateOne {

    constructor(
        private readonly repository: IPersonnelMongoRepository,
    ) { }

    async exec(_id: string, dto: UpdateEmployeeDTO) {
        return this.repository.updateOne({ _id }, { $set: dto })
    }

}