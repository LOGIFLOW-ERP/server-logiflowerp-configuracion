import { MongoRepository, SHARED_TYPES } from '@Shared/Infrastructure'
import { IProfileMongoRepository } from '../Domain'
import { inject, injectable } from 'inversify'
import { ProfileENTITY } from 'logiflowerp-sdk'

@injectable()
export class EndpointMongoRepository extends MongoRepository<ProfileENTITY> implements IProfileMongoRepository {

    constructor(
        @inject(SHARED_TYPES.database_logiflow) database: string,
        @inject(SHARED_TYPES.collection_profiles) collection: string,
    ) {
        super(database, collection)
    }

}