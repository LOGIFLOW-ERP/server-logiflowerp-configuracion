import { resolveCompanyDecorator } from '@Shared/Infrastructure/decorators';
import { PERSONNEL_TYPES } from '../IoC';
import { UseCaseGetAll } from '../../Application';
import { PersonnelMongoRepository } from '../MongoRepository';
import { collection } from '../config';

export const resolveCompanyGetAll = resolveCompanyDecorator(
    PERSONNEL_TYPES.UseCaseGetAll,
    UseCaseGetAll,
    PERSONNEL_TYPES.RepositoryMongo,
    PersonnelMongoRepository,
    collection
)