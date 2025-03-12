import { MongoRepository } from '@Shared/Infrastructure'
import { IProfileMongoRepository } from '../Domain'
import { ProfileENTITY } from 'logiflowerp-sdk'
import { collection } from './config'

export class ProfileMongoRepository extends MongoRepository<ProfileENTITY> implements IProfileMongoRepository {

    constructor(companyCode: string) {
        super(`${companyCode}_${collection}`)
    }

}