import { MongoRepository } from '@Shared/Infrastructure'
import { IRootUserMongoRepository } from '../Domain'
import { UserENTITY } from 'logiflowerp-sdk'
import { inject, injectable } from 'inversify'

@injectable()
export class RootUserMongoRepository extends MongoRepository<UserENTITY> implements IRootUserMongoRepository {

    constructor(
        @inject('collection') protected readonly collection: string,
        @inject('database') protected readonly database: string,
    ) {
        super(database, collection)
    }

}