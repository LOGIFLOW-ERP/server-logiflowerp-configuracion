import { inject, injectable } from 'inversify'
import { SHARED_TYPES } from './IoC/types';
import { AdapterRabbitMQ } from './Adapters';
import { SHARED_QUEUES } from './config';
import { UseCaseSendMailRegisterUser } from '../Application';

@injectable()
export class Worker {

    constructor(
        @inject(SHARED_TYPES.AdapterRabbitMQ) private readonly adapterRabbitMQ: AdapterRabbitMQ,
        @inject(SHARED_TYPES.UseCaseSendMailRegisterUser) private readonly useCaseSendMailRegisterUser: UseCaseSendMailRegisterUser,
    ) { }

    async exec() {
        await this.adapterRabbitMQ.subscribe({
            queue: SHARED_QUEUES.MAIL_REGISTER_USER,
            onMessage: async ({ message, user }) => {
                return await this.useCaseSendMailRegisterUser.exec(message)
            }
        })
    }
}