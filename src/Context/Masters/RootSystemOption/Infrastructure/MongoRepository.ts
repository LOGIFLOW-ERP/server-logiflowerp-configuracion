import { MongoRepository } from '@Shared/Infrastructure'
import { IRootSystemOptionMongoRepository } from '../Domain'
import { AuthUserDTO, SystemOptionENTITY } from 'logiflowerp-sdk'
import { inject, injectable } from 'inversify'
import { CONFIG_TYPES } from '@Config/types'
import { ROOT_SYSTEM_OPTION_TYPES } from './IoC'

@injectable()
export class RootSystemOptionMongoRepository extends MongoRepository<SystemOptionENTITY> implements IRootSystemOptionMongoRepository {

    constructor(
        @inject(ROOT_SYSTEM_OPTION_TYPES.Collection) protected readonly collection: string,
        @inject(CONFIG_TYPES.Env) private env: Env,
    ) {
        super(env.DB_ROOT, collection, new AuthUserDTO())
    }

}