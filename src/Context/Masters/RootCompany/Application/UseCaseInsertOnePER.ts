import { IRootCompanyMongoRepository, ISUNATCompanyData } from '../Domain';
import {
    collections,
    CompanyUserDTO,
    CreateRootCompanyPERDTO,
    prefix_col_root,
    RootCompanyENTITY,
    UserENTITY,
    validateCustom
} from 'logiflowerp-sdk';
import { ConflictException, NotFoundException, UnprocessableEntityException } from '@Config/exception';
import { env } from '@Config/env';
import { AdapterApiRequest } from '@Shared/Infrastructure';
import { RootUserMongoRepository } from '@Masters/RootUser/Infrastructure/MongoRepository';

export class UseCaseInsertOnePER {

    private transactions: ITransaction<any>[] = []

    constructor(
        private readonly repository: IRootCompanyMongoRepository,
        private readonly rootUserRepository: RootUserMongoRepository,
        private readonly adapterApiRequest: AdapterApiRequest,
    ) { }

    async exec(dto: CreateRootCompanyPERDTO) {
        const _entity = new RootCompanyENTITY()
        _entity.set(dto)
        _entity._id = crypto.randomUUID()
        const user = await this.searchUser(dto.identityManager)
        const SUNATCompanyData = await this.SUNATCompanyDataConsultation(dto.ruc)
        this.completeDataPER(_entity, SUNATCompanyData)
        const entity = await validateCustom(_entity, RootCompanyENTITY, UnprocessableEntityException)
        this.createTransactionUpdateUser(user, entity)
        this.createTransactionCreateRootCompany(entity)
        await this.repository.executeTransactionBatch(this.transactions)
    }

    private async SUNATCompanyDataConsultation(ruc: string) {
        const url = `${env.DNI_LOOKUP_API_URL}/v2/sunat/ruc/full?numero=${ruc}`
        const headers = { Authorization: `Bearer ${env.DNI_LOOKUP_API_TOKEN}` }
        const result = await this.adapterApiRequest.get<ISUNATCompanyData>(url, { headers })
        return validateCustom(result, ISUNATCompanyData, UnprocessableEntityException)
    }

    private completeDataPER(entity: RootCompanyENTITY, SUNATCompanyData: ISUNATCompanyData) {
        entity.address = SUNATCompanyData.direccion
        entity.companyname = SUNATCompanyData.razonSocial
        entity.sector = SUNATCompanyData.actividadEconomica
    }

    private async searchUser(identity: string) {
        const pipeline = [{ $match: { identity } }]
        const data = await this.rootUserRepository.select(pipeline)
        if (!data.length) {
            throw new NotFoundException(`Usuario con identificación ${identity} no encontrado`, true)
        }
        if (data.length > 1) {
            throw new ConflictException(`Hay mas de un resultado para usuario con identificación ${identity}`)
        }
        return data[0]
    }

    private createTransactionCreateRootCompany(entity: RootCompanyENTITY) {
        const transaction: ITransaction<RootCompanyENTITY> = {
            collection: `${prefix_col_root}_${collections.companies}`,
            transaction: 'insertOne',
            doc: entity
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