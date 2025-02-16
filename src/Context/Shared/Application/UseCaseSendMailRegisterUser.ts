import { AdapterMail } from '@Shared/Infrastructure/Adapters/Mail';
import { SHARED_TYPES } from '@Shared/Infrastructure/IoC/types';
import { inject, injectable } from 'inversify'
import { UserENTITY } from 'logiflowerp-sdk'
import path from 'path'
import fs from 'fs'

@injectable()
export class UseCaseSendMailRegisterUser {

    constructor(
        @inject(SHARED_TYPES.AdapterMail) private readonly adapterMail: AdapterMail
    ) { }

    async exec(entity: UserENTITY) {
        const HTMLMessage = this.prepareHTMLmessage()
        const subject = `¡Bienvenido, ${entity.names}! Activa tu cuenta en Logiflow ERP`
        await this.adapterMail.send(entity.email, subject, undefined, HTMLMessage)
        return `${this.constructor.name} ejecutado correctamente.`
    }

    private prepareHTMLmessage() {
        const filePath = path.join(__dirname, '../../../../public/registerUser.html')
        const html = fs.readFileSync(filePath, 'utf-8')
            .replace('{ENLACE_ACTIVACION}', 'http://google.com')
        return html
    }

}