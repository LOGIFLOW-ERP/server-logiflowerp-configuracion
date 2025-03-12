import { IRootCompanyMongoRepository, ISUNATCompanyData } from '../Domain';
import { CreateRootCompanyPERDTO, RootCompanyENTITY, validateCustom } from 'logiflowerp-sdk';
import { UnprocessableEntityException } from '@Config/exception';
import { env } from '@Config/env';
import { AdapterApiRequest } from '@Shared/Infrastructure';

export class UseCaseInsertOnePER {

    constructor(
        private readonly repository: IRootCompanyMongoRepository,
        private readonly adapterApiRequest: AdapterApiRequest,
    ) { }

    async exec(dto: CreateRootCompanyPERDTO) {
        const _entity = new RootCompanyENTITY()
        _entity.set(dto)
        _entity._id = crypto.randomUUID()
        const SUNATCompanyData = await this.SUNATCompanyDataConsultation(dto.ruc)
        this.completeDataPER(_entity, SUNATCompanyData)
        const entity = await validateCustom(_entity, RootCompanyENTITY, UnprocessableEntityException)
        return this.repository.insertOne(entity)
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

}