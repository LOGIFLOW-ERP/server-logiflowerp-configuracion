import { UnauthorizedException } from '@Config/exception';
import { IRootUserMongoRepository } from '@Masters/RootUser/Domain';
import { AdapterToken } from '@Shared/Infrastructure';

export class UseCaseResetPassword {

    constructor(
        private readonly repository: IRootUserMongoRepository,
        private readonly adapterToken: AdapterToken,
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