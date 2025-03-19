import { IProfileMongoRepository } from '../Domain'
import { UpdateProfileDTO } from 'logiflowerp-sdk'

export class UseCaseUpdateOne {

    constructor(
        private readonly repository: IProfileMongoRepository,
    ) { }

    async exec(_id: string, dto: UpdateProfileDTO) {
        return this.repository.updateOne({ _id }, { $set: dto })
    }

}