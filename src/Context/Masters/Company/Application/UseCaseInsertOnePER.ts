import { ICompanyMongoRepository, ISUNATCompanyData } from '../Domain';
import { CreateCompanyPERDTO, CompanyENTITY, validateCustom } from 'logiflowerp-sdk';
import { BadRequestException, UnprocessableEntityException } from '@Config/exception';
import { AdapterApiRequest, SHARED_TYPES } from '@Shared/Infrastructure';
import { inject, injectable } from 'inversify';
import { COMPANY_TYPES } from '../Infrastructure/IoC';
import { CONFIG_TYPES } from '@Config/types';
import { Axios, AxiosError } from 'axios';

@injectable()
export class UseCaseInsertOnePER {

    constructor(
        @inject(COMPANY_TYPES.RepositoryMongo) private readonly repository: ICompanyMongoRepository,
        @inject(SHARED_TYPES.AdapterApiRequest) private readonly adapterApiRequest: AdapterApiRequest,
        @inject(CONFIG_TYPES.Env) private readonly env: Env,
    ) { }

    async exec(dto: CreateCompanyPERDTO) {
        const _entity = new CompanyENTITY()
        _entity.set(dto)
        _entity._id = crypto.randomUUID()
        await this.registerPER(dto, _entity)
        const entity = await validateCustom(_entity, CompanyENTITY, UnprocessableEntityException)
        return this.repository.insertOne(entity)
    }

    private async registerPER(dto: CreateCompanyPERDTO, entity: CompanyENTITY) {
        const SUNATCompanyData = await this.SUNATCompanyDataConsultation(dto.ruc)
        this.completeDataPER(entity, SUNATCompanyData)
    }

    private async SUNATCompanyDataConsultation(ruc: string) {
        const url = `${this.env.DNI_LOOKUP_API_URL}/v2/sunat/ruc/full?numero=${ruc}`
        const headers = { Authorization: `Bearer ${this.env.DNI_LOOKUP_API_TOKEN}` }
        try {
            const result = await this.adapterApiRequest.get<ISUNATCompanyData>(url, { headers })
            return await validateCustom(result, ISUNATCompanyData, UnprocessableEntityException)
        } catch (error) {
            let message = 'Error al consultar la SUNAT'
            if (error instanceof AxiosError) {
                message = error.response?.data?.message || message
            }
            throw new BadRequestException(message, true)
        }
    }

    private completeDataPER(entity: CompanyENTITY, SUNATCompanyData: ISUNATCompanyData) {
        entity.address = SUNATCompanyData.direccion
        entity.companyname = SUNATCompanyData.razonSocial
        entity.sector = SUNATCompanyData.actividadEconomica
    }

}