import { AdapterMail } from '@Shared/Infrastructure/Adapters/Mail';
import { SHARED_TYPES } from '@Shared/Infrastructure/IoC/types';
import { inject, injectable } from 'inversify'
import { UserENTITY } from 'logiflowerp-sdk';

@injectable()
export class UseCaseSendMailRegisterUser {

    constructor(
        @inject(SHARED_TYPES.AdapterMail) private readonly adapterMail: AdapterMail
    ) { }

    async exec(entity: UserENTITY) {
        console.log('Mail enviado')
        return `${this.constructor.name} ejecutado correctamente.`
    }

}