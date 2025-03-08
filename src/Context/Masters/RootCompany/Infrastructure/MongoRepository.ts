import { MongoRepository } from '@Shared/Infrastructure/Repositories/Mongo'
import { IRootCompanyMongoRepository } from '../Domain'
import { RootCompanyENTITY } from 'logiflowerp-sdk'
import { collection } from './config'

export class RootCompanyMongoRepository extends MongoRepository<RootCompanyENTITY> implements IRootCompanyMongoRepository {

    constructor(companyCode: string) {
        super(`${companyCode}_${collection}`)
    }

}