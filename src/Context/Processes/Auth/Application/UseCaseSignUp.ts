import { env, UnprocessableEntityException } from '@Config'
import { IRENIECPersonalData, IUserMongoRepository } from '@Masters/User/Domain'
import { USER_TYPES } from '@Masters/User/Infrastructure'
import { AdapterApiRequest, SHARED_TYPES } from '@Shared/Infrastructure'
import { inject, injectable } from 'inversify'
import { CreateUserDTO, UserENTITY, validateCustom } from 'logiflowerp-sdk'

@injectable()
export class UseCaseSignUp { 

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
		newUser.set(dto)
		newUser.names = RENIECPersonalData.nombres
		newUser.surnames = `${RENIECPersonalData.apellidoPaterno} ${RENIECPersonalData.apellidoMaterno}`
		return newUser
	}

}