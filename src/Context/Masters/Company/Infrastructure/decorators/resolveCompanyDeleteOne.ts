import { resolveCompanyDecorator } from '@Shared/Infrastructure/decorators';
import { COMPANY_TYPES } from '../IoC';
import { UseCaseDeleteOne } from '../../Application';
import { CompanyMongoRepository } from '../MongoRepository';
import { collection } from '../config';

export const resolveCompanyDeleteOne = resolveCompanyDecorator(
    COMPANY_TYPES.UseCaseDeleteOne,
    UseCaseDeleteOne,
    COMPANY_TYPES.RepositoryMongo,
    CompanyMongoRepository,
    collection
)