import { inject, injectable } from 'inversify'
import { IRENIECPersonalData, IUserMongoRepository } from '../Domain'
import { USER_TYPES } from '../Infrastructure'
import { CreateUserDTO, UserENTITY, validateCustom } from 'logiflowerp-sdk'
import { AdapterApiRequest, SHARED_TYPES } from '@Shared/Infrastructure'
import { env, UnprocessableEntityException } from '@Config'

@injectable()
export class UseCaseInsertOne {

	constructor(
		@inject(USER_TYPES.MongoRepository) private readonly repository: IUserMongoRepository,
		@inject(SHARED_TYPES.AdapterApiRequest) private readonly adapterApiRequest: AdapterApiRequest,
	) { }

	async exec(dto: CreateUserDTO) {
		const RENIECPersonalData = await this.RENIECPersonalDataConsultation(dto.identity)
		const entity = this.completeUserData(dto, RENIECPersonalData)
		const validatedEntity = await validateCustom(entity, UserENTITY, UnprocessableEntityException)
		return await this.repository.insertOne(validatedEntity)
	}

	private async RENIECPersonalDataConsultation(dni: string) {
		const url = `${env.DNI_LOOKUP_API_URL}/v2/reniec/dni?numero=${dni}`
		const headers = { Authorization: `Bearer ${env.DNI_LOOKUP_API_TOKEN}` }
		const result = await this.adapterApiRequest.get<IRENIECPersonalData>(url, { headers })
		return await validateCustom(result, IRENIECPersonalData, UnprocessableEntityException)
	}

	private completeUserData(dto: CreateUserDTO, RENIECPersonalData: IRENIECPersonalData) {
		const newUser = new UserENTITY()
		newUser.names = RENIECPersonalData.nombres
		newUser.surnames = `${RENIECPersonalData.apellidoPaterno} ${RENIECPersonalData.apellidoMaterno}`
		newUser.set(dto)
		return newUser
	}

}
