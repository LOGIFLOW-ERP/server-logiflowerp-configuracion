import { IMongoRepository } from '@Shared/Domain'
import { OpcionSistemaENTITY } from 'logiflowerp-sdk'

export interface IOpcionSistemaMongoRepository extends IMongoRepository<OpcionSistemaENTITY> { }