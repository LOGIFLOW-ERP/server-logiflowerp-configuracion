import { RootUserMongoRepository } from '@Masters/RootUser/Infrastructure/MongoRepository'
import { IRootCompanyMongoRepository } from '../Domain'
import { collections, CompanyUserDTO, prefix_col_root, RootCompanyENTITY, UpdateRootCompanyDTO, UserENTITY } from 'logiflowerp-sdk'
import { ConflictException, NotFoundException } from '@Config/exception'

export class UseCaseUpdateOne {

    private transactions: ITransaction<any>[] = []

    constructor(
        private readonly repository: IRootCompanyMongoRepository,
        private readonly rootUserRepository: RootUserMongoRepository,
    ) { }

    async exec(_id: string, dto: UpdateRootCompanyDTO) {
        const { changedManager, rootCompany } = await this.changedManager(_id, dto)
        if (changedManager) {
            const user = await this.searchAndValidateUser(dto.identityManager)
            this.createTransactionUpdateUser(user, rootCompany)
        }
        this.createTransactionUpdateRootCompany(_id, dto)
        await this.repository.executeTransactionBatch(this.transactions)
        // return this.repository.updateOne({ _id }, { $set: dto })
    }

    private async changedManager(_id: string, dto: UpdateRootCompanyDTO) {
        const pipeline = [{ $match: { _id } }]
        const data = await this.repository.select(pipeline)
        if (!data.length) {
            throw new NotFoundException(`Empresa root con _id ${_id} no encontrado`)
        }
        if (data.length > 1) {
            throw new ConflictException(`Hay mas de un resultado para empresa root con _id ${_id}`)
        }
        return { changedManager: data[0].identityManager !== dto.identityManager, rootCompany: data[0] }
    }

    private async searchAndValidateUser(identity: string) { // MISMA VALIDACION SE DEBE HACER EN CREAR
        const pipeline = [{ $match: { identity } }]
        const data = await this.rootUserRepository.select(pipeline)
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

    private createTransactionUpdateRootCompany(_id: string, dto: UpdateRootCompanyDTO) {
        const transaction: ITransaction<RootCompanyENTITY> = {
            collection: `${prefix_col_root}_${collections.companies}`,
            transaction: 'updateOne',
            filter: { _id },
            update: { $set: dto }
        }
        this.transactions.push(transaction)
    }

    private createTransactionUpdateUser(user: UserENTITY, entity: RootCompanyENTITY) {
        const company = new CompanyUserDTO()
        company.set(entity)
        const transaction: ITransaction<UserENTITY> = {
            collection: `${prefix_col_root}_${collections.users}`,
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