import { ContainerModule } from 'inversify';
import { ROOT_SYSTEM_OPTION_TYPES } from './types';
import { RootSystemOptionMongoRepository } from '../MongoRepository';
import { UseCaseFind, UseCaseSave } from '../../Application';
import { collection } from '../config';

export const containerModule = new ContainerModule(bind => {
    bind(ROOT_SYSTEM_OPTION_TYPES.RepositoryMongo).to(RootSystemOptionMongoRepository)
    bind(ROOT_SYSTEM_OPTION_TYPES.UseCaseFind).to(UseCaseFind)
    bind(ROOT_SYSTEM_OPTION_TYPES.UseCaseSave).to(UseCaseSave)
    bind(ROOT_SYSTEM_OPTION_TYPES.Collection).toConstantValue(collection)
})