import { IMongoRepository } from '@Shared/Domain'
import { EmployeeENTITY } from 'logiflowerp-sdk'

export interface IPersonnelMongoRepository extends IMongoRepository<EmployeeENTITY> { }