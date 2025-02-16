import { ConflictException, ForbiddenException, UnauthorizedException } from '@Config';
import { IUserMongoRepository } from '@Masters/User/Domain';
import { USER_TYPES } from '@Masters/User/Infrastructure';
import { AdapterToken, SHARED_TYPES } from '@Shared/Infrastructure';
import { inject, injectable } from 'inversify'
import { SignInDTO, TokenPayloadDTO, UserENTITY } from 'logiflowerp-sdk';

@injectable()
export class UseCaseSignIn {

    constructor(
        @inject(USER_TYPES.MongoRepository) private readonly repository: IUserMongoRepository,
        @inject(SHARED_TYPES.AdapterToken) private readonly adapterToken: AdapterToken,
    ) { }

    async exec(dto: SignInDTO) {
        if (!dto.state) {
            throw new ForbiddenException('El usuario está inactivo.')
        }
        if (!dto.emailVerified) {
            throw new UnauthorizedException('Correo no veirifcado.')
        }
        const user = await this.searchUser(dto.email)
        this.verifyPassword(dto, user)
        const payload = this.generatePayloadToken(user)
        const token = await this.adapterToken.create(payload)
        return token
    }

    private generatePayloadToken(entity: UserENTITY) {
        const payload = new TokenPayloadDTO()
        payload.user.set(entity)
        return payload
    }

    private verifyPassword(dto: SignInDTO, user: UserENTITY) {
        // const isValid = await this.hashService.compare(password, user.password);
        // if (!isValid) throw new AuthError('Credenciales inválidas');
        const isValid = dto.password !== user.password
        if (!isValid) {
            throw new UnauthorizedException('Credenciales inválidas.')
        }
    }

    private async searchUser(email: string) {
        const pipeline = [{ $match: { email } }]
        const data = await this.repository.select(pipeline)
        if (!data.length) {
            throw new UnauthorizedException('Credenciales inválidas.')
        }
        if (data.length > 1) {
            throw new ConflictException(`Error al autenticarse.`)
        }
        return data[0]
    }

}