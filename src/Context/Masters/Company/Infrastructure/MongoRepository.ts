import { MongoRepository } from '@Shared/Infrastructure/Repositories/Mongo'
import { ICompanyMongoRepository } from '../Domain'
import { CompanyENTITY } from 'logiflowerp-sdk'
import { collection } from './config'

export class CompanyMongoRepository extends MongoRepository<CompanyENTITY> implements ICompanyMongoRepository {

    constructor(companyCode: string) {
        super(`${companyCode}_${collection}`)
    }

}