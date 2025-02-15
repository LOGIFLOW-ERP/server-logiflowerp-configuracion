import { ContainerModule } from 'inversify'
import { USER_TYPES } from './types'
import { UserMongoRepository } from '../MongoRepository'
import { UseCaseFind, UseCaseInsertOne, UseCaseUpdateOne } from '../../Application'

export const containerModule = new ContainerModule(bind => {
    bind(USER_TYPES.MongoRepository).to(UserMongoRepository)
    bind(USER_TYPES.UseCaseFind).to(UseCaseFind)
    bind(USER_TYPES.UseCaseInsertOne).to(UseCaseInsertOne)
    bind(USER_TYPES.UseCaseUpdateOne).to(UseCaseUpdateOne)
})