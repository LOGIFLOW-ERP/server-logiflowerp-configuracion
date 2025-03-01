import { MongoRepository } from '@Shared/Infrastructure/Repositories/Mongo'
import { IProductGroupMongoRepository } from '../Domain'
import { inject, injectable } from 'inversify'
import { CurrencyENTITY } from 'logiflowerp-sdk'
import { SHARED_TYPES } from '@Shared/Infrastructure/IoC'

@injectable()
export class CurrencyMongoRepository extends MongoRepository<CurrencyENTITY> implements IProductGroupMongoRepository {

    constructor(
        @inject(SHARED_TYPES.database_logiflow) database: string,
        @inject(SHARED_TYPES.collection_currencies) collection: string,
    ) {
        super(database, collection)
    }

}