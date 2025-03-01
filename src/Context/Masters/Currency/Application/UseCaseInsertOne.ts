import { inject, injectable } from 'inversify';
import { PRODUCT_GROUP_TYPES } from '../Infrastructure/IoC';
import { IProductGroupMongoRepository } from '../Domain';
import { CreateProductGroupDTO, CurrencyENTITY, validateCustom } from 'logiflowerp-sdk';
import { UnprocessableEntityException } from '@Config/exception';

@injectable()
export class UseCaseInsertOne {

    constructor(
        @inject(PRODUCT_GROUP_TYPES.MongoRepository) private readonly repository: IProductGroupMongoRepository,
    ) { }

    async exec(dto: CreateProductGroupDTO) {
        const _entity = new CurrencyENTITY()
        _entity.set(dto)
        const entity = await validateCustom(_entity, CurrencyENTITY, UnprocessableEntityException)
        return this.repository.insertOne(entity)
    }

}