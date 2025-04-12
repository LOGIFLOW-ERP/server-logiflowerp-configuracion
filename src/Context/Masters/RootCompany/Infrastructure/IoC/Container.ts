import { ContainerModule } from 'inversify';
import { ROOT_COMPANY_TYPES } from './types';
import { RootCompanyMongoRepository } from '../MongoRepository';
import {
    UseCaseDeleteOne,
    UseCaseFind,
    UseCaseGetActive,
    UseCaseGetAll,
    UseCaseInsertOne,
    UseCaseInsertOnePER,
    UseCaseUpdateOne
} from '../../Application';
import { collection } from '../config';

export const containerModule = new ContainerModule(bind => {
    bind(ROOT_COMPANY_TYPES.RepositoryMongo).to(RootCompanyMongoRepository)
    bind(ROOT_COMPANY_TYPES.UseCaseDeleteOne).to(UseCaseDeleteOne)
    bind(ROOT_COMPANY_TYPES.UseCaseFind).to(UseCaseFind)
    bind(ROOT_COMPANY_TYPES.UseCaseGetActive).to(UseCaseGetActive)
    bind(ROOT_COMPANY_TYPES.UseCaseGetAll).to(UseCaseGetAll)
    bind(ROOT_COMPANY_TYPES.UseCaseInsertOne).to(UseCaseInsertOne)
    bind(ROOT_COMPANY_TYPES.UseCaseInsertOnePER).to(UseCaseInsertOnePER)
    bind(ROOT_COMPANY_TYPES.UseCaseUpdateOne).to(UseCaseUpdateOne)
    bind(ROOT_COMPANY_TYPES.Collection).toConstantValue(collection)
})