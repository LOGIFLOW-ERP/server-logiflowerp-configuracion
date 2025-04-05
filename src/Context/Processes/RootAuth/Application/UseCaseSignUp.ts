import { UnprocessableEntityException } from '@Config/exception'
import { CONFIG_TYPES } from '@Config/types'
import { IRENIECPersonalData, IRootUserMongoRepository } from '@Masters/RootUser/Domain'
import { AdapterApiRequest } from '@Shared/Infrastructure'
import { inject, injectable } from 'inversify'
import { CreateUserDTO, DocumentType, UserENTITY, validateCustom } from 'logiflowerp-sdk'

@injectable()
export class UseCaseSignUp {

	constructor(
		private readonly repository: IRootUserMongoRepository,
		private readonly adapterApiRequest: AdapterApiRequest,
		@inject(CONFIG_TYPES.Env) private readonly env: Env,
	) { }

	async exec(dto: CreateUserDTO) {
		const RENIECPersonalData = await this.RENIECPersonalDataConsultation(dto)
		const entity = this.completeUserData(dto, RENIECPersonalData)
		const validatedEntity = await validateCustom(entity, UserENTITY, UnprocessableEntityException)
		return this.repository.insertOne(validatedEntity)
	}

	private async RENIECPersonalDataConsultation(dto: CreateUserDTO) {
		if (dto.documentType !== DocumentType.DNI) return
		const url = `${this.env.DNI_LOOKUP_API_URL}/v2/reniec/dni?numero=${dto.identity}`
		const headers = { Authorization: `Bearer ${this.env.DNI_LOOKUP_API_TOKEN}` }
		const result = await this.adapterApiRequest.get<IRENIECPersonalData>(url, { headers })
		return validateCustom(result, IRENIECPersonalData, UnprocessableEntityException)
	}

	private completeUserData(dto: CreateUserDTO, RENIECPersonalData: IRENIECPersonalData | undefined) {
		const newUser = new UserENTITY()
		newUser._id = crypto.randomUUID()
		newUser.set(dto)
		if (RENIECPersonalData) {
			newUser.names = RENIECPersonalData.nombres
			newUser.surnames = `${RENIECPersonalData.apellidoPaterno} ${RENIECPersonalData.apellidoMaterno}`
		}
		return newUser
	}

}