import { MongoRepository } from '@Shared/Infrastructure'
import { IRootUserMongoRepository } from '../Domain'
import { AuthUserDTO, UserENTITY } from 'logiflowerp-sdk'
import { inject, injectable } from 'inversify'
import { CONFIG_TYPES } from '@Config/types'
import { ROOT_USER_TYPES } from './IoC'

@injectable()
export class RootUserMongoRepository extends MongoRepository<UserENTITY> implements IRootUserMongoRepository {

    constructor(
        @inject(ROOT_USER_TYPES.Collection) protected readonly collection: string,
        @inject(CONFIG_TYPES.Env) private env: Env,
    ) {
        super(env.DB_ROOT, collection, new AuthUserDTO())
    }

}