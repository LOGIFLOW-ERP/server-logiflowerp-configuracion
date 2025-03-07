import { inject, injectable } from 'inversify';
import { COMPANY_TYPES } from '../Infrastructure/IoC';
import { ICompanyMongoRepository } from '../Domain';
import { CreateCompanyDTO, CompanyENTITY, validateCustom } from 'logiflowerp-sdk';
import { UnprocessableEntityException } from '@Config/exception';

@injectable()
export class UseCaseInsertOne {

    constructor(
        @inject(COMPANY_TYPES.MongoRepository) private readonly repository: ICompanyMongoRepository,
    ) { }

    async exec(dto: CreateCompanyDTO) {
        const _entity = new CompanyENTITY()
        _entity.set(dto)
        const entity = await validateCustom(_entity, CompanyENTITY, UnprocessableEntityException)
        return this.repository.insertOne(entity)
    }

}