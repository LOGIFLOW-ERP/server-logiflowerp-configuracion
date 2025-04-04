import { IPersonnelMongoRepository } from '../Domain';
import { CreateEmployeeDTO, EmployeeENTITY, State, validateCustom } from 'logiflowerp-sdk';
import { ConflictException, NotFoundException, UnprocessableEntityException } from '@Config/exception';
import { IRootUserMongoRepository } from '@Masters/RootUser/Domain';
import { inject, injectable } from 'inversify'
import { PERSONNEL_TYPES } from '../Infrastructure/IoC'

@injectable()
export class UseCaseInsertOne {

    constructor(
        @inject(PERSONNEL_TYPES.RepositoryMongo) private readonly repository: IPersonnelMongoRepository,
        @inject(PERSONNEL_TYPES.RepositoryMongo) private readonly repositoryRootUser: IRootUserMongoRepository
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
        const result = await this.repositoryRootUser.select(pipeline)
        if (!result.length) {
            throw new NotFoundException(`Usuario con identificación "${identity}" aún no está registrado o está inactivo`, true)
        }
        if (result.length > 1) {
            throw new ConflictException(`Hay mas de un resultado para usuario con identificación "${identity}"`)
        }
        return result[0]
    }

}