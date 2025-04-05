import { resolveCompanyDecorator } from '@Shared/Infrastructure/decorators';
import { PERSONNEL_TYPES } from '../IoC';
import { UseCaseFind } from '../../Application';
import { PersonnelMongoRepository } from '../MongoRepository';
import { collection } from '../config';

export const resolveCompanyFind = resolveCompanyDecorator(
    PERSONNEL_TYPES.UseCaseFind,
    UseCaseFind,
    PERSONNEL_TYPES.RepositoryMongo,
    PersonnelMongoRepository,
    collection
)