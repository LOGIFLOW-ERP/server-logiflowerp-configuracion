import { ContainerModule } from 'inversify';
import { ROOT_USER_TYPES } from './types';
import { RootUserMongoRepository } from '../MongoRepository';
import { UseCaseFind, UseCaseGetByIdentity, UseCaseUpdateOne } from '../../Application';
import { collection } from '../config';

export const containerModule = new ContainerModule(bind => {
    bind(ROOT_USER_TYPES.RepositoryMongo).to(RootUserMongoRepository)
    bind(ROOT_USER_TYPES.UseCaseFind).to(UseCaseFind)
    bind(ROOT_USER_TYPES.UseCaseGetByIdentity).to(UseCaseGetByIdentity)
    bind(ROOT_USER_TYPES.UseCaseUpdateOne).to(UseCaseUpdateOne)
    bind(ROOT_USER_TYPES.Collection).toConstantValue(collection)
})