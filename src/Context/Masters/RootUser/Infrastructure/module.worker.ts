import { AdapterRabbitMQ, SHARED_TYPES } from '@Shared/Infrastructure'
import { inject, injectable } from 'inversify'

@injectable()
export class Worker {

    constructor(
        @inject(SHARED_TYPES.AdapterRabbitMQ) private readonly adapterRabbitMQ: AdapterRabbitMQ
    ) { }

    async exec() {
        await this.adapterRabbitMQ.subscribe({
            queue: 'test',
            onMessage: async ({ message, user }) => {
                return ''
            }
        })
    }
}