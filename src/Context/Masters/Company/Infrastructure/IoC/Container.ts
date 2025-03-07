import { ContainerModule } from 'inversify'
import { COMPANY_TYPES } from './types'
import { CompanyMongoRepository } from '../MongoRepository'
import {
    UseCaseDeleteOne,
    UseCaseFind,
    UseCaseGetAll,
    UseCaseInsertOne,
    UseCaseUpdateOne,
} from '../../Application'

export const containerModule = new ContainerModule(bind => {
    bind(COMPANY_TYPES.MongoRepository).to(CompanyMongoRepository)
    bind(COMPANY_TYPES.UseCaseFind).to(UseCaseFind)
    bind(COMPANY_TYPES.UseCaseGetAll).to(UseCaseGetAll)
    bind(COMPANY_TYPES.UseCaseInsertOne).to(UseCaseInsertOne)
    bind(COMPANY_TYPES.UseCaseUpdateOne).to(UseCaseUpdateOne)
    bind(COMPANY_TYPES.UseCaseDeleteOne).to(UseCaseDeleteOne)
})