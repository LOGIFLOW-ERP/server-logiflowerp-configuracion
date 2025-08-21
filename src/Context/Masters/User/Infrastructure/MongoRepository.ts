import { MongoRepository, SHARED_TYPES } from '@Shared/Infrastructure'
import { IUserMongoRepository } from '../Domain'
import { AuthUserDTO, UserENTITY } from 'logiflowerp-sdk'
import { inject, injectable } from 'inversify'

@injectable()
export class UserMongoRepository extends MongoRepository<UserENTITY> implements IUserMongoRepository {

    constructor(
        @inject('collection') protected readonly collection: string,
        @inject('database') protected readonly database: string,
        @inject(SHARED_TYPES.User) protected readonly user: AuthUserDTO,
    ) {
        super(database, collection, user)
    }

}