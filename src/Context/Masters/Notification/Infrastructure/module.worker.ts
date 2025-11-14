import { AdapterMail, AdapterRabbitMQ, AdapterSocket, createTenantScopedContainer, SHARED_TYPES } from '@Shared/Infrastructure';
import { inject, injectable } from 'inversify'
import { NOTIFICATION_TYPES } from './IoC';
import { UseCaseInsertOne } from '../Application';
import { NotificationMongoRepository } from './MongoRepository';
import { collection } from './config';
import { env } from '@Config/env';

@injectable()
export class Worker {
    constructor(
        @inject(SHARED_TYPES.AdapterRabbitMQ) private readonly rabbitMQ: AdapterRabbitMQ,
        @inject(SHARED_TYPES.AdapterMail) private readonly adapterMail: AdapterMail,
        @inject(SHARED_TYPES.AdapterSocket) private readonly adapterSocket: AdapterSocket,
    ) { }

    async exec() {
        await this.resolveCountryChangeStateBaremos()
    }

    private async resolveCountryChangeStateBaremos() {
        const queue = 'Notification_UseCaseInsertOne'
        await this.rabbitMQ.subscribe({
            queue,
            onMessage: async ({ message, user }) => {
                try {
                    if (!user) {
                        throw new Error(`No se envió usuario`)
                    }
                    const tenantContainer = createTenantScopedContainer(
                        NOTIFICATION_TYPES.UseCaseInsertOne,
                        NOTIFICATION_TYPES.RepositoryMongo,
                        UseCaseInsertOne,
                        NotificationMongoRepository,
                        user.rootCompany.code, // database
                        collection,
                        user.user
                    )
                    const useCase = tenantContainer.get<UseCaseInsertOne>(NOTIFICATION_TYPES.UseCaseInsertOne)
                    const not = await useCase.exec(message)
                    // this.adapterSocket.getIO().to(`user:${not._id}`).emit('order:completed', { _id });
                    this.adapterSocket.getIO().to(`user:${not.usuarioId}`).emit('notification:insertOne', not);
                    console.log(`>> Se creó notificación ${not._id}`)
                } catch (error) {
                    const subject = `¡Error al crear notificación!`
                    await this.adapterMail.send(env.DEVELOPERS_MAILS, subject, (error as Error).message, undefined)
                }
            }
        })
        console.log('\x1b[34m%s\x1b[0m', `>>> Suscrito a: ${queue}`)
    }
}