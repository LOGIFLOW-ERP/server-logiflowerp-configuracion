import { IRootCompanyMongoRepository, ISUNATCompanyData } from '../Domain';
import {
    collections,
    CompanyUserDTO,
    CreateRootCompanyPERDTO,
    RootCompanyENTITY,
    UserENTITY,
    validateCustom
} from 'logiflowerp-sdk';
import { ConflictException, NotFoundException, UnprocessableEntityException } from '@Config/exception';
import { AdapterApiRequest, SHARED_TYPES } from '@Shared/Infrastructure';
import { inject, injectable } from 'inversify';
import { CONFIG_TYPES } from '@Config/types';
import { ROOT_COMPANY_TYPES } from '../Infrastructure/IoC';

@injectable()
export class UseCaseInsertOnePER {

    private transactions: ITransaction<any>[] = []

    constructor(
        @inject(ROOT_COMPANY_TYPES.RepositoryMongo) private readonly repository: IRootCompanyMongoRepository,
        @inject(SHARED_TYPES.AdapterApiRequest) private readonly adapterApiRequest: AdapterApiRequest,
        @inject(CONFIG_TYPES.Env) private readonly env: Env,
    ) { }

    async exec(dto: CreateRootCompanyPERDTO) {
        const _entity = new RootCompanyENTITY()
        _entity.set(dto)
        _entity._id = crypto.randomUUID()
        const user = await this.searchAndValidateUser(dto.identityManager)
        const SUNATCompanyData = await this.SUNATCompanyDataConsultation(dto.ruc)
        this.completeDataPER(_entity, SUNATCompanyData)
        const entity = await validateCustom(_entity, RootCompanyENTITY, UnprocessableEntityException)
        this.createTransactionUpdateUser(user, entity)
        this.createTransactionCreateRootCompany(entity)
        await this.repository.executeTransactionBatch(this.transactions)
    }

    private async SUNATCompanyDataConsultation(ruc: string) {
        const url = `${this.env.DNI_LOOKUP_API_URL}/v2/sunat/ruc/full?numero=${ruc}`
        const headers = { Authorization: `Bearer ${this.env.DNI_LOOKUP_API_TOKEN}` }
        const result = await this.adapterApiRequest.get<ISUNATCompanyData>(url, { headers })
        return validateCustom(result, ISUNATCompanyData, UnprocessableEntityException)
    }

    private completeDataPER(entity: RootCompanyENTITY, SUNATCompanyData: ISUNATCompanyData) {
        entity.address = SUNATCompanyData.direccion
        entity.companyname = SUNATCompanyData.razonSocial
        entity.sector = SUNATCompanyData.actividadEconomica
    }

    private async searchAndValidateUser(identity: string) { // MISMA VALIDACION SE DEBE HACER EN EDITAR
        const pipeline = [{ $match: { identity } }]
        const data = await this.repository.select<UserENTITY>(pipeline, collections.users, this.env.BD_ROOT)
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