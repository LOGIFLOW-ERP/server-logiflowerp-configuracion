import { MongoRepository } from '@Shared/Infrastructure/Repositories/Mongo'
import { ICompanyMongoRepository } from '../Domain'
import { inject, injectable } from 'inversify'
import { CompanyENTITY } from 'logiflowerp-sdk'
import { SHARED_TYPES } from '@Shared/Infrastructure/IoC'

@injectable()
export class CompanyMongoRepository extends MongoRepository<CompanyENTITY> implements ICompanyMongoRepository {

    constructor(
        @inject(SHARED_TYPES.database_logiflow) database: string,
        @inject(SHARED_TYPES.collection_companies) collection: string,
    ) {
        super(database, collection)
    }

}