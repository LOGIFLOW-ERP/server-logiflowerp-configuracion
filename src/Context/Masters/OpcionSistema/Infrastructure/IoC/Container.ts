import { ContainerModule } from 'inversify'
import { OPCION_SISTEMA_TYPES } from './types'
import { EndpointMongoRepository } from '../MongoRepository'
import {
    // UseCaseFind,
    UseCaseSave
} from '../../Application'

export const containerModule = new ContainerModule(bind => {
    bind(OPCION_SISTEMA_TYPES.MongoRepository).to(EndpointMongoRepository)
    // bind(OPCION_SISTEMA_TYPES.UseCaseFind).to(UseCaseFind)
    bind(OPCION_SISTEMA_TYPES.UseCaseSave).to(UseCaseSave)
})