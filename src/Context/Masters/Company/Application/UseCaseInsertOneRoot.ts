import { inject, injectable } from 'inversify';
import { COMPANY_TYPES } from '../Infrastructure/IoC';
import { ICompanyMongoRepository, ISUNATCompanyData } from '../Domain';
import { CompanyENTITY, validateCustom, CreateCompanyRootPERDTO } from 'logiflowerp-sdk';
import { UnprocessableEntityException } from '@Config/exception';
import { env } from '@Config/env';
import { AdapterApiRequest, SHARED_TYPES } from '@Shared/Infrastructure';

@injectable()
export class UseCaseInsertOneRoot {

    constructor(
        @inject(COMPANY_TYPES.MongoRepository) private readonly repository: ICompanyMongoRepository,
        @inject(SHARED_TYPES.AdapterApiRequest) private readonly adapterApiRequest: AdapterApiRequest,
    ) { }

    async exec(dto: CreateCompanyRootPERDTO) {
        const _entity = new CompanyENTITY()
        _entity.set(dto)
        _entity._id = crypto.randomUUID()
        await this.registerPER(dto, _entity)
        const entity = await validateCustom(_entity, CompanyENTITY, UnprocessableEntityException)
        return this.repository.insertOne(entity)
    }

    private async registerPER(dto: CreateCompanyRootPERDTO, entity: CompanyENTITY) {
        if (dto.country !== 'PER') return
        const SUNATCompanyData = await this.SUNATCompanyDataConsultation(dto.ruc)
        this.completeDataPER(entity, SUNATCompanyData)
    }

    private async SUNATCompanyDataConsultation(ruc: string) {
        const url = `${env.DNI_LOOKUP_API_URL}/v2/sunat/ruc/full?numero=${ruc}`
        const headers = { Authorization: `Bearer ${env.DNI_LOOKUP_API_TOKEN}` }
        const result = await this.adapterApiRequest.get<ISUNATCompanyData>(url, { headers })
        return await validateCustom(result, ISUNATCompanyData, UnprocessableEntityException)
    }

    private completeDataPER(entity: CompanyENTITY, SUNATCompanyData: ISUNATCompanyData) {
        entity.address = SUNATCompanyData.direccion
        entity.companyname = SUNATCompanyData.razonSocial
        entity.sector = SUNATCompanyData.actividadEconomica
    }

}