import { IRootCompanyMongoRepository } from '../Domain';
import { CreateRootCompanyDTO, RootCompanyENTITY, validateCustom } from 'logiflowerp-sdk';
import { UnprocessableEntityException } from '@Config/exception';
import { ROOT_COMPANY_TYPES } from '../Infrastructure/IoC';
import { inject, injectable } from 'inversify';

@injectable()
export class UseCaseInsertOne {

    constructor(
        @inject(ROOT_COMPANY_TYPES.RepositoryMongo) private readonly repository: IRootCompanyMongoRepository,
    ) { }

    async exec(dto: CreateRootCompanyDTO) {
        const _entity = new RootCompanyENTITY()
        _entity.set(dto)
        _entity._id = crypto.randomUUID()
        const entity = await validateCustom(_entity, RootCompanyENTITY, UnprocessableEntityException)
        return this.repository.insertOne(entity)
    }

}