import { MongoRepository } from '@Shared/Infrastructure'
import { IRootSystemOptionMongoRepository } from '../Domain'
import { SystemOptionENTITY } from 'logiflowerp-sdk'
import { collection } from './config'

export class RootSystemOptionMongoRepository extends MongoRepository<SystemOptionENTITY> implements IRootSystemOptionMongoRepository {

    constructor(prefix_col: string) {
        super(`${prefix_col}_${collection}`)
    }

}