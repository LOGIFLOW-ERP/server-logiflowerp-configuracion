import { resolveCompanyDecorator } from '@Shared/Infrastructure/decorators';
import { CURRENCY_TYPES } from '../IoC';
import { UseCaseInsertOne } from '../../Application';
import { CurrencyMongoRepository } from '../MongoRepository';
import { collection } from '../config';

export const resolveCompanyInsertOne = resolveCompanyDecorator(
    CURRENCY_TYPES.UseCaseInsertOne,
    UseCaseInsertOne,
    CURRENCY_TYPES.RepositoryMongo,
    CurrencyMongoRepository,
    collection
)