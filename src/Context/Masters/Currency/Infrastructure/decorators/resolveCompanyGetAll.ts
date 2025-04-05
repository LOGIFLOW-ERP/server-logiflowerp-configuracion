import { resolveCompanyDecorator } from '@Shared/Infrastructure/decorators';
import { CURRENCY_TYPES } from '../IoC';
import { UseCaseGetAll } from '../../Application';
import { CurrencyMongoRepository } from '../MongoRepository';
import { collection } from '../config';

export const resolveCompanyGetAll = resolveCompanyDecorator(
    CURRENCY_TYPES.UseCaseGetAll,
    UseCaseGetAll,
    CURRENCY_TYPES.RepositoryMongo,
    CurrencyMongoRepository,
    collection
)