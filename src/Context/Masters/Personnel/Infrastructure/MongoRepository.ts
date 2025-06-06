import { MongoRepository } from '@Shared/Infrastructure/Repositories/Mongo'
import { IPersonnelMongoRepository } from '../Domain'
import { AuthUserDTO, EmployeeENTITY } from 'logiflowerp-sdk'
import { inject, injectable } from 'inversify'
import { SHARED_TYPES } from '@Shared/Infrastructure'

@injectable()
export class PersonnelMongoRepository extends MongoRepository<EmployeeENTITY> implements IPersonnelMongoRepository {

    constructor(
        @inject('collection') protected readonly collection: string,
        @inject('database') protected readonly database: string,
        @inject(SHARED_TYPES.User) protected readonly user: AuthUserDTO,
    ) {
        super(database, collection, user)
    }

}