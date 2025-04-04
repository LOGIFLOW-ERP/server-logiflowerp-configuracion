import { resolveCompanyDecorator } from '@Shared/Infrastructure/decorators';
import { COMPANY_TYPES } from '../IoC';
import { UseCaseUpdateOne } from '../../Application';
import { CompanyMongoRepository } from '../MongoRepository';
import { collection } from '../config';

export const resolveCompanyUpdateOne = resolveCompanyDecorator(
    COMPANY_TYPES.UseCaseUpdateOne,
    UseCaseUpdateOne,
    COMPANY_TYPES.RepositoryMongo,
    CompanyMongoRepository,
    collection
)