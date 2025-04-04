import { IProfileMongoRepository } from '../Domain'
import { UpdateProfileDTO } from 'logiflowerp-sdk'
import { inject, injectable } from 'inversify'
import { PROFILE_TYPES } from '../Infrastructure/IoC'

@injectable()
export class UseCaseUpdateOne {

    constructor(
        @inject(PROFILE_TYPES.RepositoryMongo) private readonly repository: IProfileMongoRepository,
    ) { }

    async exec(_id: string, dto: UpdateProfileDTO) {
        return this.repository.updateOne({ _id }, { $set: dto })
    }

}