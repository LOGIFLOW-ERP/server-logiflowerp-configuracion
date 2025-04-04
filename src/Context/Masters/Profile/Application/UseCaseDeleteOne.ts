import { IProfileMongoRepository } from '../Domain'
import { inject, injectable } from 'inversify'
import { PROFILE_TYPES } from '../Infrastructure/IoC'

@injectable()
export class UseCaseDeleteOne {

    constructor(
        @inject(PROFILE_TYPES.RepositoryMongo) private readonly repository: IProfileMongoRepository,
    ) { }

    async exec(_id: string) {
        return this.repository.deleteOne({ _id })
    }

}