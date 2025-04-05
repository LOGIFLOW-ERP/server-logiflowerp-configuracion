import { MongoRepository } from '@Shared/Infrastructure/Repositories/Mongo'
import { IPersonnelMongoRepository } from '../Domain'
import { EmployeeENTITY } from 'logiflowerp-sdk'
import { inject, injectable } from 'inversify'

@injectable()
export class PersonnelMongoRepository extends MongoRepository<EmployeeENTITY> implements IPersonnelMongoRepository {

    constructor(
        @inject('collection') protected readonly collection: string,
        @inject('database') protected readonly database: string,
    ) {
        super(database, collection)
    }

}