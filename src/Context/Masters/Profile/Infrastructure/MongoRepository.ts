import { MongoRepository, SHARED_TYPES } from '@Shared/Infrastructure'
import { IProfileMongoRepository } from '../Domain'
import { AuthUserDTO, ProfileENTITY } from 'logiflowerp-sdk'
import { inject, injectable } from 'inversify'

@injectable()
export class ProfileMongoRepository extends MongoRepository<ProfileENTITY> implements IProfileMongoRepository {

    constructor(
        @inject('collection') protected readonly collection: string,
        @inject('database') protected readonly database: string,
        @inject(SHARED_TYPES.User) protected readonly user: AuthUserDTO,
    ) {
        super(database, collection, user)
    }

}