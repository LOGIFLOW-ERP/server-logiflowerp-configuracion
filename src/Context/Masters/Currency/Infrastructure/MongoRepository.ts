import { MongoRepository } from '@Shared/Infrastructure/Repositories/Mongo'
import { ICurrencyMongoRepository } from '../Domain'
import { CurrencyENTITY } from 'logiflowerp-sdk'
import { inject } from 'inversify'

export class CurrencyMongoRepository extends MongoRepository<CurrencyENTITY> implements ICurrencyMongoRepository {

    constructor(
        @inject('collection') protected readonly collection: string,
        @inject('database') protected readonly database: string,
    ) {
        super(database, collection)
    }

}