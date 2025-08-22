import { ForbiddenException } from '@Config/exception';
import { AdapterEncryption, MongoRepository, SHARED_TYPES } from '@Shared/Infrastructure';
import { inject, injectable } from 'inversify';
import {
    AuthUserDTO,
    ChangePasswordDTO,
    collections,
    State,
    UserENTITY
} from 'logiflowerp-sdk';

@injectable()
export class UseCaseChangePassword {
    constructor(
        @inject(SHARED_TYPES.AdapterEncryption) private readonly adapterEncryption: AdapterEncryption,
    ) { }

    async exec(userAuth: AuthUserDTO, data: ChangePasswordDTO, tenant: string) {
        const repository = new MongoRepository<UserENTITY>(tenant, collections.user, userAuth)

        const user = await this.searchUser(userAuth._id, repository)

        const isValid = await this.adapterEncryption.verifyPassword(data.password, user.password)
        if (!isValid) {
            throw new ForbiddenException('Contraseña actual inválida', true)
        }

        if (data.newPassword !== data.confirmNewPassword) {
            throw new ForbiddenException('Nueva contraseña y confirmación no coinciden', true)
        }

        const _isValid = await this.adapterEncryption.verifyPassword(data.newPassword, user.password)
        if (_isValid) {
            throw new ForbiddenException('La nueva contraseña no puede ser igual a la anterior', true)
        }

        const newPasswordHash = await this.adapterEncryption.hashPassword(data.newPassword)

        await repository.updateOne(
            { _id: user._id },
            { $set: { password: newPasswordHash } }
        )

    }

    private searchUser(_id: string, repository: MongoRepository<UserENTITY>) {
        const pipeline = [{ $match: { _id, state: State.ACTIVO, isDeleted: false } }]
        return repository.selectOne(pipeline)
    }
}