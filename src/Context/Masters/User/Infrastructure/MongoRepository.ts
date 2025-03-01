import { MongoRepository, SHARED_TYPES } from '@Shared/Infrastructure'
import { IUserMongoRepository } from '../Domain'
import { inject, injectable } from 'inversify'
import { UserENTITY } from 'logiflowerp-sdk'

@injectable()
export class UserMongoRepository extends MongoRepository<UserENTITY> implements IUserMongoRepository {

    constructor(
        @inject(SHARED_TYPES.database_logiflow) database: string,
        @inject(SHARED_TYPES.collection_users) collection: string,
    ) {
        super(database, collection)
    }

}