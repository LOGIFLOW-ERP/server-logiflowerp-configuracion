import { ContainerModule } from 'inversify'
import { PROFILE_TYPES } from './types'
import { EndpointMongoRepository } from '../MongoRepository'
import {
    UseCaseFind,
    UseCaseSave
} from '../../Application'

export const containerModule = new ContainerModule(bind => {
    bind(PROFILE_TYPES.MongoRepository).to(EndpointMongoRepository)
    bind(PROFILE_TYPES.UseCaseFind).to(UseCaseFind)
    bind(PROFILE_TYPES.UseCaseSave).to(UseCaseSave)
})