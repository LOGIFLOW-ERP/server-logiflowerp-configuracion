import { IMongoRepository } from '@Shared/Domain'
import { ProfileENTITY } from 'logiflowerp-sdk'

export interface IProfileMongoRepository extends IMongoRepository<ProfileENTITY> { }