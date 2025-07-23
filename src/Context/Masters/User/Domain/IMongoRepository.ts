import { IMongoRepository } from '@Shared/Domain'
import { UserENTITY } from 'logiflowerp-sdk'

export interface IRootUserMongoRepository extends IMongoRepository<UserENTITY> { }