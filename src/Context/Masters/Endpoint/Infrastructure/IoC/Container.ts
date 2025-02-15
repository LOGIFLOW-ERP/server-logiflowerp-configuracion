import { ContainerModule } from 'inversify'
import { ENDPOINT_TYPES } from './types'
import { EndpointMongoRepository } from '../MongoRepository'
import {
    UseCaseFind,
    UseCaseSaveRoutes
} from '../../Application'

export const containerModule = new ContainerModule(bind => {
    bind(ENDPOINT_TYPES.MongoRepository).to(EndpointMongoRepository)
    bind(ENDPOINT_TYPES.UseCaseFind).to(UseCaseFind)
    bind(ENDPOINT_TYPES.UseCaseSaveRoutes).to(UseCaseSaveRoutes)
})