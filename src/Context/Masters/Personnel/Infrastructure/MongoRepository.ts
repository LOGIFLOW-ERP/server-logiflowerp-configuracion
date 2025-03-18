import { MongoRepository } from '@Shared/Infrastructure/Repositories/Mongo'
import { IPersonnelMongoRepository } from '../Domain'
import { EmployeeENTITY } from 'logiflowerp-sdk'
import { collection } from './config'

export class PersonnelMongoRepository extends MongoRepository<EmployeeENTITY> implements IPersonnelMongoRepository {

    constructor(companyCode: string) {
        super(`${companyCode}_${collection}`)
    }

}