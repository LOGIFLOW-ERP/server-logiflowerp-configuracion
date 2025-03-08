import { IMongoRepository } from '@Shared/Domain'
import { RootCompanyENTITY } from 'logiflowerp-sdk'

export interface IRootCompanyMongoRepository extends IMongoRepository<RootCompanyENTITY> { }