import { IMongoRepository } from '@Shared/Domain'
import { EndpointENTITY } from 'logiflowerp-sdk'

export interface IEndpointMongoRepository extends IMongoRepository<EndpointENTITY> {
    save(data: EndpointENTITY[]): Promise<void>
}