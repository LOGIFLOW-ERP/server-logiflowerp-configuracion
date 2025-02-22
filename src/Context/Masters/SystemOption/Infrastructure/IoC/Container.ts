import { ContainerModule } from 'inversify'
import { SYSTEM_OPTION_TYPES } from './types'
import { EndpointMongoRepository } from '../MongoRepository'
import {
    UseCaseFind,
    UseCaseSave
} from '../../Application'

export const containerModule = new ContainerModule(bind => {
    bind(SYSTEM_OPTION_TYPES.MongoRepository).to(EndpointMongoRepository)
    bind(SYSTEM_OPTION_TYPES.UseCaseFind).to(UseCaseFind)
    bind(SYSTEM_OPTION_TYPES.UseCaseSave).to(UseCaseSave)
})