import { IPersonnelMongoRepository } from '../Domain'
import { UpdateEmployeeDTO } from 'logiflowerp-sdk'
import { inject, injectable } from 'inversify'
import { PERSONNEL_TYPES } from '../Infrastructure/IoC'

@injectable()
export class UseCaseUpdateOne {

    constructor(
        @inject(PERSONNEL_TYPES.RepositoryMongo) private readonly repository: IPersonnelMongoRepository,
    ) { }

    async exec(_id: string, dto: UpdateEmployeeDTO) {
        return this.repository.updateOne({ _id }, { $set: dto })
    }

}