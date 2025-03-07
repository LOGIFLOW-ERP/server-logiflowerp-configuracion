import { IMongoRepository } from '@Shared/Domain'
import { CompanyENTITY } from 'logiflowerp-sdk'

export interface ICompanyMongoRepository extends IMongoRepository<CompanyENTITY> { }