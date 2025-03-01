import { IMongoRepository } from '@Shared/Domain'
import { CurrencyENTITY } from 'logiflowerp-sdk'

export interface ICurrencyMongoRepository extends IMongoRepository<CurrencyENTITY> { }