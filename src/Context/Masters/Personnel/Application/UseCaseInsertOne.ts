import { IPersonnelMongoRepository } from '../Domain';
import { collections, CreateEmployeeDTO, EmployeeENTITY, State, UserENTITY, validateCustom } from 'logiflowerp-sdk';
import { UnprocessableEntityException } from '@Config/exception';
import { inject, injectable } from 'inversify'
import { PERSONNEL_TYPES } from '../Infrastructure/IoC'

@injectable()
export class UseCaseInsertOne {

    constructor(
        @inject(PERSONNEL_TYPES.RepositoryMongo) private readonly repository: IPersonnelMongoRepository,
    ) { }

    async exec(dto: CreateEmployeeDTO) {
        const user = await this.searchUser(dto.identity)
        const _entity = new EmployeeENTITY()
        _entity.set(user)
        _entity.set(dto)
        const entity = await validateCustom(_entity, EmployeeENTITY, UnprocessableEntityException)
        return this.repository.insertOne(entity)
    }

    private searchUser(identity: string) {
        const pipeline = [{ $match: { identity, state: State.ACTIVO, isDeleted: false } }]
        return this.repository.selectOne<UserENTITY>(pipeline, collections.user)
    }

}