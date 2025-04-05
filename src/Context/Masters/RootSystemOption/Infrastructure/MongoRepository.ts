import { MongoRepository } from '@Shared/Infrastructure'
import { IRootSystemOptionMongoRepository } from '../Domain'
import { SystemOptionENTITY } from 'logiflowerp-sdk'
import { inject, injectable } from 'inversify'
import { ROOT_USER_TYPES } from '@Masters/RootUser/Infrastructure/IoC'
import { CONFIG_TYPES } from '@Config/types'

@injectable()
export class RootSystemOptionMongoRepository extends MongoRepository<SystemOptionENTITY> implements IRootSystemOptionMongoRepository {

    constructor(
        @inject(ROOT_USER_TYPES.Collection) protected readonly collection: string,
        @inject(CONFIG_TYPES.Env) private env: Env,
    ) {
        super(env.BD_ROOT, collection)
    }

}