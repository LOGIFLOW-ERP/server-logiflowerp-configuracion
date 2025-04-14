import { IPersonnelMongoRepository } from '../Domain';
import { collections, CreateEmployeeDTO, EmployeeENTITY, State, UserENTITY, validateCustom } from 'logiflowerp-sdk';
import { ConflictException, NotFoundException, UnprocessableEntityException } from '@Config/exception';
import { inject, injectable } from 'inversify'
import { PERSONNEL_TYPES } from '../Infrastructure/IoC'
import { CONFIG_TYPES } from '@Config/types';

@injectable()
export class UseCaseInsertOne {

    constructor(
        @inject(PERSONNEL_TYPES.RepositoryMongo) private readonly repository: IPersonnelMongoRepository,
        @inject(CONFIG_TYPES.Env) private readonly env: Env,
    ) { }

    async exec(dto: CreateEmployeeDTO) {
        const user = await this.searchUser(dto.identity)
        const _entity = new EmployeeENTITY()
        _entity.set(user)
        _entity.set(dto)
        const entity = await validateCustom(_entity, EmployeeENTITY, UnprocessableEntityException)
        return this.repository.insertOne(entity)
    }

    private async searchUser(identity: string) {
        const pipeline = [{ $match: { identity, state: State.ACTIVO } }]
        const result = await this.repository.select<UserENTITY>(pipeline, collections.users, this.env.DB_ROOT)
        if (!result.length) {
            throw new NotFoundException(`Usuario con identificación "${identity}" aún no está registrado o está inactivo`, true)
        }
        if (result.length > 1) {
            throw new ConflictException(`Hay mas de un resultado para usuario con identificación "${identity}"`)
        }
        return result[0]
    }

}