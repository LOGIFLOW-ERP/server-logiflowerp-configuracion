import { AdapterMail, AdapterToken, MongoRepository, SHARED_TYPES } from '@Shared/Infrastructure';
import { AuthUserDTO, collections, State, TokenPayloadDTO, UserENTITY } from 'logiflowerp-sdk';
import path from 'path'
import fs from 'fs'
import { inject, injectable } from 'inversify';
import { CONFIG_TYPES } from '@Config/types';

@injectable()
export class UseCaseRequestPasswordReset {

    constructor(
        @inject(SHARED_TYPES.AdapterToken) private readonly adapterToken: AdapterToken,
        @inject(SHARED_TYPES.AdapterMail) private readonly adapterMail: AdapterMail,
        @inject(CONFIG_TYPES.Env) private readonly env: Env,
    ) { }

    async exec(email: string, tenant: string) {
        const user = await this.searchUser(email, tenant)
        const payload = this.generatePayloadToken(user)
        const token = await this.adapterToken.create(payload, undefined, 180)
        const HTMLMessage = this.prepareHTMLmessage(token, user)
        const subject = `Recuperación de contraseña`
        await this.adapterMail.send(user.email, subject, undefined, HTMLMessage)
    }

    private generatePayloadToken(entity: UserENTITY) {
        const payload = new TokenPayloadDTO()
        payload.user.set(entity)
        return payload
    }

    private searchUser(email: string, tenant: string) {
        const repository = new MongoRepository<UserENTITY>(tenant, collections.user, new AuthUserDTO())
        const pipeline = [{ $match: { email, state: State.ACTIVO, isDeleted: false } }]
        return repository.selectOne(pipeline)
    }

    private prepareHTMLmessage(token: string, user: UserENTITY) {
        const filePath = path.join(__dirname, '../../../../../public/RequestPasswordReset.html')
        const html = fs.readFileSync(filePath, 'utf-8')
            .replace('{{ENLACE_RESTABLECER_CONTRASEÑA}}', `${this.env.FRONTEND_URL}reset-password?token=${token}`)
            .replace('{{names}}', user.names)
        return html
    }

}
