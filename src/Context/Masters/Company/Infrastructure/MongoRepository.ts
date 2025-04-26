import { MongoRepository } from '@Shared/Infrastructure/Repositories/Mongo'
import { ICompanyMongoRepository } from '../Domain'
import { AuthUserDTO, CompanyENTITY } from 'logiflowerp-sdk'
import { inject, injectable } from 'inversify'
import { SHARED_TYPES } from '@Shared/Infrastructure'

@injectable()
export class CompanyMongoRepository extends MongoRepository<CompanyENTITY> implements ICompanyMongoRepository {

    constructor(
        @inject('collection') protected readonly collection: string,
        @inject('database') protected readonly database: string,
        @inject(SHARED_TYPES.User) protected readonly user: AuthUserDTO,
    ) {
        super(database, collection, user)
    }

}