import { MongoRepository } from '@Shared/Infrastructure/Repositories/Mongo'
import { ICurrencyMongoRepository } from '../Domain'
import { AuthUserDTO, CurrencyENTITY } from 'logiflowerp-sdk'
import { inject, injectable } from 'inversify'
import { SHARED_TYPES } from '@Shared/Infrastructure'

@injectable()
export class CurrencyMongoRepository extends MongoRepository<CurrencyENTITY> implements ICurrencyMongoRepository {

    constructor(
        @inject('collection') protected readonly collection: string,
        @inject('database') protected readonly database: string,
        @inject(SHARED_TYPES.User) protected readonly user: AuthUserDTO,
    ) {
        super(database, collection, user)
    }

}