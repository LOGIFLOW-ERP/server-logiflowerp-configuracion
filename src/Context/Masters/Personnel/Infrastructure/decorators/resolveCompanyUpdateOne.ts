import { resolveCompanyDecorator } from '@Shared/Infrastructure/decorators';
import { PERSONNEL_TYPES } from '../IoC';
import { UseCaseUpdateOne } from '../../Application';
import { PersonnelMongoRepository } from '../MongoRepository';
import { collection } from '../config';

export const resolveCompanyUpdateOne = resolveCompanyDecorator(
    PERSONNEL_TYPES.UseCaseUpdateOne,
    UseCaseUpdateOne,
    PERSONNEL_TYPES.RepositoryMongo,
    PersonnelMongoRepository,
    collection
)