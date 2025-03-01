import { MongoRepository, SHARED_TYPES } from '@Shared/Infrastructure'
import { ISystemOptionMongoRepository } from '../Domain'
import { inject, injectable } from 'inversify'
import { SystemOptionENTITY } from 'logiflowerp-sdk'

@injectable()
export class EndpointMongoRepository extends MongoRepository<SystemOptionENTITY> implements ISystemOptionMongoRepository {

    constructor(
        @inject(SHARED_TYPES.database_logiflow) database: string,
        @inject(SHARED_TYPES.collection_systemOptions) collection: string,
    ) {
        super(database, collection)
    }

}