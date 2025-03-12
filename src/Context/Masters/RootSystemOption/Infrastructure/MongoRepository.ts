import { MongoRepository } from '@Shared/Infrastructure'
import { ISystemOptionMongoRepository } from '../Domain'
import { injectable } from 'inversify'
import { SystemOptionENTITY } from 'logiflowerp-sdk'
import { collection } from './config'

@injectable()
export class RootSystemOptionMongoRepository extends MongoRepository<SystemOptionENTITY> implements ISystemOptionMongoRepository {

    constructor(prefix_col: string) {
        super(`${prefix_col}_${collection}`)
    }

}