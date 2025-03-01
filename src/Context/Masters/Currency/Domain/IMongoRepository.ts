import { IMongoRepository } from '@Shared/Domain'
import { CurrencyENTITY } from 'logiflowerp-sdk'

export interface IProductGroupMongoRepository extends IMongoRepository<CurrencyENTITY> { }