import { ForbiddenException } from '@Config/exception';
import { AdapterToken, MongoRepository, SHARED_TYPES } from '@Shared/Infrastructure';
import { inject, injectable } from 'inversify';
import { AuthUserDTO, collections, UserENTITY } from 'logiflowerp-sdk';

@injectable()
export class UseCaseResetPassword {

    constructor(
        @inject(SHARED_TYPES.AdapterToken) private readonly adapterToken: AdapterToken,
    ) { }

    async exec(token: string, newPassword: string, tenant: string) {

        const payload = await this.adapterToken.verify(token)
        if (!payload) {
            throw new ForbiddenException('Token inválido o expirado', true)
        }

        const repository = new MongoRepository<UserENTITY>(tenant, collections.user, new AuthUserDTO())

        await repository.updateOne(
            { _id: payload.user._id },
            { $set: { password: newPassword } }
        )

    }

}