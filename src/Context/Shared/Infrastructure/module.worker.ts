import { inject, injectable } from 'inversify'
import { SHARED_TYPES } from './IoC/types';
import { AdapterRabbitMQ } from './Adapters';
import { UseCaseSendMailRegisterUser } from '../Application';
import { getQueueNameInitializationCollections, getQueueNameMailRegisterUser } from 'logiflowerp-sdk';
import { CONFIG_TYPES } from '@Config/types';
import { initCollections } from '@Config/collections';

@injectable()
export class Worker {

    constructor(
        @inject(SHARED_TYPES.AdapterRabbitMQ) private readonly adapterRabbitMQ: AdapterRabbitMQ,
        @inject(SHARED_TYPES.UseCaseSendMailRegisterUser) private readonly useCaseSendMailRegisterUser: UseCaseSendMailRegisterUser,
        @inject(CONFIG_TYPES.Env) private readonly env: Env,
    ) { }

    async exec() {
        await this.adapterRabbitMQ.subscribe({
            queue: getQueueNameMailRegisterUser({ NODE_ENV: this.env.NODE_ENV }),
            onMessage: async ({ message, user }) => {
                return await this.useCaseSendMailRegisterUser.exec(message)
            }
        })
        await this.adapterRabbitMQ.subscribe({
            queue: getQueueNameInitializationCollections({ NODE_ENV: this.env.NODE_ENV }),
            onMessage: async ({ message, user }) => {
                await initCollections(message)
                return 'Colecciones inicializadas'
            }
        })
    }
}