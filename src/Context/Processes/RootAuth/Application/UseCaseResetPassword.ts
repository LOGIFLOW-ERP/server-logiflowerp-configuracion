import { ForbiddenException } from '@Config/exception';
import { IRootUserMongoRepository } from '@Masters/RootUser/Domain';
import { ROOT_USER_TYPES } from '@Masters/RootUser/Infrastructure/IoC';
import { AdapterToken, SHARED_TYPES } from '@Shared/Infrastructure';
import { inject, injectable } from 'inversify';

@injectable()
export class UseCaseResetPassword {

    constructor(
        @inject(ROOT_USER_TYPES.RepositoryMongo) private readonly repository: IRootUserMongoRepository,
        @inject(SHARED_TYPES.AdapterToken) private readonly adapterToken: AdapterToken,
    ) { }

    async exec(token: string, newPassword: string) {

        const payload = await this.adapterToken.verify(token)
        if (!payload) {
            throw new ForbiddenException('Token inválido o expirado', true)
        }

        await this.repository.updateOne(
            { _id: payload.user._id },
            { $set: { password: newPassword } }
        )

    }

}