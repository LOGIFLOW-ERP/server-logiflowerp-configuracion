import { MongoRepository } from '@Shared/Infrastructure/Repositories/Mongo'
import { IRootCompanyMongoRepository } from '../Domain'
import { AuthUserDTO, RootCompanyENTITY } from 'logiflowerp-sdk'
import { inject } from 'inversify'
import { ROOT_COMPANY_TYPES } from './IoC'
import { CONFIG_TYPES } from '@Config/types'

export class RootCompanyMongoRepository extends MongoRepository<RootCompanyENTITY> implements IRootCompanyMongoRepository {

    constructor(
        @inject(ROOT_COMPANY_TYPES.Collection) protected readonly collection: string,
        @inject(CONFIG_TYPES.Env) private env: Env,
    ) {
        super(env.DB_ROOT, collection, new AuthUserDTO())
    }

}