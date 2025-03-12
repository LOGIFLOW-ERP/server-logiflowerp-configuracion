import { MongoRepository } from '@Shared/Infrastructure'
import { IRootUserMongoRepository } from '../Domain'
import { UserENTITY } from 'logiflowerp-sdk'
import { collection } from './config'

export class RootUserMongoRepository extends MongoRepository<UserENTITY> implements IRootUserMongoRepository {

    constructor(prefix_col: string) {
        super(`${prefix_col}_${collection}`)
    }

}