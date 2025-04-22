import { IRootCompanyMongoRepository } from '../Domain';
import {
    collections,
    CompanyENTITY,
    CompanyUserDTO,
    CreateRootCompanyDTO,
    RootCompanyENTITY,
    UserENTITY,
    validateCustom
} from 'logiflowerp-sdk';
import { ConflictException, NotFoundException, UnprocessableEntityException } from '@Config/exception';
import { ROOT_COMPANY_TYPES } from '../Infrastructure/IoC';
import { inject, injectable } from 'inversify';

@injectable()
export class UseCaseInsertOne {

    private transactions: ITransaction<any>[] = []

    constructor(
        @inject(ROOT_COMPANY_TYPES.RepositoryMongo) private readonly repository: IRootCompanyMongoRepository,
    ) { }

    async exec(dto: CreateRootCompanyDTO) {
        const _entity = new RootCompanyENTITY()
        _entity.set(dto)
        _entity._id = crypto.randomUUID()
        const user = await this.searchAndValidateUser(dto.identityManager)
        const entityRoot = await validateCustom(_entity, RootCompanyENTITY, UnprocessableEntityException)
        const entity = await validateCustom(_entity, CompanyENTITY, UnprocessableEntityException)
        this.createTransactionUpdateUser(user, entityRoot)
        this.createTransactionCreateCompany(entity)
        this.createTransactionCreateRootCompany(entityRoot)
        await this.repository.executeTransactionBatch(this.transactions)
    }

    private async searchAndValidateUser(identity: string) { // MISMA VALIDACION SE DEBE HACER EN EDITAR
        const pipeline = [{ $match: { identity } }]
        const data = await this.repository.select<UserENTITY>(pipeline, collections.users)
        if (!data.length) {
            throw new NotFoundException(`Usuario con identificación ${identity} no encontrado`, true)
        }
        if (data.length > 1) {
            throw new ConflictException(`Hay mas de un resultado para usuario con identificación ${identity}`)
        }
        if (data[0].root) {
            throw new ConflictException(`El usuario con identificación ${identity}, ya es root`)
        }
        return data[0]
    }

    private createTransactionCreateRootCompany(entity: RootCompanyENTITY) {
        const transaction: ITransaction<RootCompanyENTITY> = {
            collection: collections.companies,
            transaction: 'insertOne',
            doc: entity
        }
        this.transactions.push(transaction)
    }

    private createTransactionCreateCompany(entity: CompanyENTITY) {
        const transaction: ITransaction<CompanyENTITY> = {
            database: entity.code,
            collection: collections.companies,
            transaction: 'insertOne',
            doc: entity
        }
        this.transactions.push(transaction)
    }

    private createTransactionUpdateUser(user: UserENTITY, entity: RootCompanyENTITY) {
        const company = new CompanyUserDTO()
        company.set(entity)
        const transaction: ITransaction<UserENTITY> = {
            collection: collections.users,
            transaction: 'updateOne',
            filter: { _id: user._id },
            update: {
                $set: {
                    root: true,
                    company
                }
            }
        }
        this.transactions.push(transaction)
    }

}