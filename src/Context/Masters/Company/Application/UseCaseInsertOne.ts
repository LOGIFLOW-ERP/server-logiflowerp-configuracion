import { ICompanyMongoRepository } from '../Domain';
import { CompanyENTITY, validateCustom, CreateCompanyDTO } from 'logiflowerp-sdk';
import { UnprocessableEntityException } from '@Config/exception';
import { inject, injectable } from 'inversify';
import { COMPANY_TYPES } from '../Infrastructure/IoC';

@injectable()
export class UseCaseInsertOne {

    constructor(
        @inject(COMPANY_TYPES.RepositoryMongo) private readonly repository: ICompanyMongoRepository,
    ) { }

    async exec(dto: CreateCompanyDTO) {
        const _entity = new CompanyENTITY()
        _entity.set(dto)
        _entity._id = crypto.randomUUID()
        const entity = await validateCustom(_entity, CompanyENTITY, UnprocessableEntityException)
        return this.repository.insertOne(entity)
    }

}