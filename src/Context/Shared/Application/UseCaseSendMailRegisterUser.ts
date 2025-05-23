import { AdapterMail } from '@Shared/Infrastructure/Adapters/Mail';
import { SHARED_TYPES } from '@Shared/Infrastructure/IoC/types';
import { inject, injectable } from 'inversify'
import { TokenPayloadDTO, UserENTITY } from 'logiflowerp-sdk'
import path from 'path'
import fs from 'fs'
import { AdapterToken } from '@Shared/Infrastructure';
import { CONFIG_TYPES } from '@Config/types';

@injectable()
export class UseCaseSendMailRegisterUser {

    constructor(
        @inject(SHARED_TYPES.AdapterMail) private readonly adapterMail: AdapterMail,
        @inject(SHARED_TYPES.AdapterToken) private readonly adapterToken: AdapterToken,
        @inject(CONFIG_TYPES.Env) private readonly env: Env,
    ) { }

    async exec(entity: UserENTITY) {
        const payload = this.generatePayloadToken(entity)
        const token = await this.adapterToken.create(payload, undefined, 86400)
        const HTMLMessage = this.prepareHTMLmessage(token)
        const subject = `¡Bienvenido, ${entity.names}! Activa tu cuenta en Logiflow ERP`
        await this.adapterMail.send(entity.email, subject, undefined, HTMLMessage)
        return `${this.constructor.name} ejecutado correctamente.`
    }

    private generatePayloadToken(entity: UserENTITY) {
        const payload = new TokenPayloadDTO()
        payload.user.set(entity)
        return payload
    }

    private prepareHTMLmessage(token: string) {
        const filePath = path.join(__dirname, '../../../../public/RegisterUser.html')
        const html = fs.readFileSync(filePath, 'utf-8')
            .replace('{{ENLACE_ACTIVACION}}', `${this.env.FRONTEND_URL}verify-email?token=${token}`)
        return html
    }

}