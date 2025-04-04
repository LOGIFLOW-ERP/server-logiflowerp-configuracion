import { MongoRepository } from '@Shared/Infrastructure/Repositories/Mongo'
import { ICompanyMongoRepository } from '../Domain'
import { CompanyENTITY } from 'logiflowerp-sdk'
import { inject, injectable } from 'inversify'

@injectable()
export class CompanyMongoRepository extends MongoRepository<CompanyENTITY> implements ICompanyMongoRepository {

    constructor(
        @inject('collection') protected readonly collection: string,
        @inject('database') protected readonly database: string,
    ) {
        super(database, collection)
    }

}