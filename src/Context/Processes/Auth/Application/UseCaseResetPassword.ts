import { UnauthorizedException } from '@Config/exception';
import { IUserMongoRepository } from '@Masters/User/Domain';
import { USER_TYPES } from '@Masters/User/Infrastructure';
import { AdapterToken, SHARED_TYPES } from '@Shared/Infrastructure';
import { inject, injectable } from 'inversify'

@injectable()
export class UseCaseResetPassword {

    constructor(
        @inject(USER_TYPES.MongoRepository) private readonly repository: IUserMongoRepository,
        @inject(SHARED_TYPES.AdapterToken) private readonly adapterToken: AdapterToken,
    ) { }

    async exec(token: string, newPassword: string) {

        const payload = await this.adapterToken.verify(token)
        if (!payload) {
            throw new UnauthorizedException('Token inválido o expirado', true)
        }

        await this.repository.updateOne(
            { _id: payload.user._id },
            { $set: { password: newPassword } }
        )

    }

}