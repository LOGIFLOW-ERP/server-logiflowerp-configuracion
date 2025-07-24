import { UnprocessableEntityException } from '@Config/exception'
import { CONFIG_TYPES } from '@Config/types'
import { IRENIECPersonalData } from '@Masters/User/Domain'
import { AdapterApiRequest, MongoRepository, SHARED_TYPES } from '@Shared/Infrastructure'
import { inject, injectable } from 'inversify'
import { AuthUserDTO, collections, CreateUserDTO, DocumentType, UserENTITY, validateCustom } from 'logiflowerp-sdk'

@injectable()
export class UseCaseSignUp {

	constructor(
		@inject(SHARED_TYPES.AdapterApiRequest) private readonly adapterApiRequest: AdapterApiRequest,
		@inject(CONFIG_TYPES.Env) private readonly env: Env,
	) { }

	async exec(dto: CreateUserDTO, tenant: string) {
		const repository = new MongoRepository<UserENTITY>(tenant, collections.user, new AuthUserDTO())
		const RENIECPersonalData = await this.RENIECPersonalDataConsultation(dto)
		const entity = this.completeUserData(dto, RENIECPersonalData)
		const validatedEntity = await validateCustom(entity, UserENTITY, UnprocessableEntityException)
		return repository.insertOne(validatedEntity)
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