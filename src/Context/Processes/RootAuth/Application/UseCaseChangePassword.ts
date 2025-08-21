import { ForbiddenException } from '@Config/exception';
import { MongoRepository } from '@Shared/Infrastructure';
import { injectable } from 'inversify';
import {
    AuthUserDTO,
    ChangePasswordDTO,
    collections,
    State,
    UserENTITY
} from 'logiflowerp-sdk';

@injectable()
export class UseCaseChangePassword {
    async exec(userAuth: AuthUserDTO, data: ChangePasswordDTO, tenant: string) {
        const repository = new MongoRepository<UserENTITY>(tenant, collections.user, userAuth)

        const user = await this.searchUser(userAuth._id, repository)

        if (user.password !== data.password) {
            throw new ForbiddenException('Contraseña actual inválida', true)
        }

        if (data.newPassword !== data.confirmNewPassword) {
            throw new ForbiddenException('Nueva contraseña y confirmación no coinciden', true)
        }

        if (user.password === data.newPassword) {
            throw new ForbiddenException('La nueva contraseña no puede ser igual a la anterior', true)
        }

        await repository.updateOne(
            { _id: user._id },
            { $set: { password: data.newPassword } }
        )

    }

    private searchUser(_id: string, repository: MongoRepository<UserENTITY>) {
        const pipeline = [{ $match: { _id, state: State.ACTIVO, isDeleted: false } }]
        return repository.selectOne(pipeline)
    }
}