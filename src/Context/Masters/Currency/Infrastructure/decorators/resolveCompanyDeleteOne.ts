import { resolveCompanyDecorator } from '@Shared/Infrastructure/decorators';
import { CURRENCY_TYPES } from '../IoC';
import { UseCaseDeleteOne } from '../../Application';
import { CurrencyMongoRepository } from '../MongoRepository';
import { collection } from '../config';

export const resolveCompanyDeleteOne = resolveCompanyDecorator(
    CURRENCY_TYPES.UseCaseDeleteOne,
    UseCaseDeleteOne,
    CURRENCY_TYPES.RepositoryMongo,
    CurrencyMongoRepository,
    collection
)