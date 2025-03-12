import { MongoRepository } from '@Shared/Infrastructure/Repositories/Mongo'
import { ICurrencyMongoRepository } from '../Domain'
import { CurrencyENTITY } from 'logiflowerp-sdk'
import { collection } from './config'

export class CurrencyMongoRepository extends MongoRepository<CurrencyENTITY> implements ICurrencyMongoRepository {

    constructor(companyCode: string) {
        super(`${companyCode}_${collection}`)
    }

}