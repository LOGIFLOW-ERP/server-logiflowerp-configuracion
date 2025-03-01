import { ContainerModule } from 'inversify'
import { CURRENCY_TYPES } from './types'
import { CurrencyMongoRepository } from '../MongoRepository'
import {
    UseCaseDeleteOne,
    UseCaseFind,
    UseCaseGetAll,
    UseCaseInsertOne,
    UseCaseUpdateOne,
} from '../../Application'

export const containerModule = new ContainerModule(bind => {
    bind(CURRENCY_TYPES.MongoRepository).to(CurrencyMongoRepository)
    bind(CURRENCY_TYPES.UseCaseFind).to(UseCaseFind)
    bind(CURRENCY_TYPES.UseCaseGetAll).to(UseCaseGetAll)
    bind(CURRENCY_TYPES.UseCaseInsertOne).to(UseCaseInsertOne)
    bind(CURRENCY_TYPES.UseCaseUpdateOne).to(UseCaseUpdateOne)
    bind(CURRENCY_TYPES.UseCaseDeleteOne).to(UseCaseDeleteOne)
})