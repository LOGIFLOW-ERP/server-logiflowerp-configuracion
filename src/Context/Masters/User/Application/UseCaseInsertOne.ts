import { inject, injectable } from 'inversify'
import { IRENIECPersonalData, IUserMongoRepository } from '../Domain'
import { USER_TYPES } from '../Infrastructure'
import { UserENTITY, validateCustom } from 'logiflowerp-sdk'
import { AdapterApiRequest, SHARED_TYPES } from '@Shared/Infrastructure'
import { env, UnprocessableEntityException } from '@Config'

@injectable()
export class UseCaseInsertOne {

	constructor(
		@inject(USER_TYPES.MongoRepository) private readonly repository: IUserMongoRepository,
		@inject(SHARED_TYPES.AdapterApiRequest) private readonly adapterApiRequest: AdapterApiRequest,
	) { }

	async exec(entity: UserENTITY) {
		const RENIECPersonalData = await this.RENIECPersonalDataConsultation(entity.identity)
		this.completeUserData(entity, RENIECPersonalData)
		const validatedEntity = await validateCustom(entity, UserENTITY, UnprocessableEntityException)
		return await this.repository.insertOne(validatedEntity)
	}

	private async RENIECPersonalDataConsultation(dni: string) {
		const url = `${env.DNI_LOOKUP_API_URL}/v2/reniec/dni?numero=${dni}`
		const headers = { Authorization: `Bearer ${env.DNI_LOOKUP_API_TOKEN}` }
		const result = await this.adapterApiRequest.get<IRENIECPersonalData>(url, { headers })
		return result
	}

	private completeUserData(entity: UserENTITY, RENIECPersonalData: IRENIECPersonalData) {
		entity.names = RENIECPersonalData.nombres
		entity.surnames = `${RENIECPersonalData.apellidoPaterno} ${RENIECPersonalData.apellidoMaterno}`
	}

}
