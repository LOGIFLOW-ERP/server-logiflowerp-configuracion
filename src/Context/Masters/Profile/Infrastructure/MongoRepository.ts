import { MongoRepository } from '@Shared/Infrastructure'
import { IProfileMongoRepository } from '../Domain'
import { injectable } from 'inversify'
import { ProfileENTITY } from 'logiflowerp-sdk'
import { collection } from './config'

@injectable()
export class EndpointMongoRepository extends MongoRepository<ProfileENTITY> implements IProfileMongoRepository {

    constructor(companyCode: string) {
        super(`${companyCode}_${collection}`)
    }

}