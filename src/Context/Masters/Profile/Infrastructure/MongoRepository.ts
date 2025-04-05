import { MongoRepository } from '@Shared/Infrastructure'
import { IProfileMongoRepository } from '../Domain'
import { ProfileENTITY } from 'logiflowerp-sdk'
import { inject, injectable } from 'inversify'

@injectable()
export class ProfileMongoRepository extends MongoRepository<ProfileENTITY> implements IProfileMongoRepository {

    constructor(
        @inject('collection') protected readonly collection: string,
        @inject('database') protected readonly database: string,
    ) {
        super(database, collection)
    }

}