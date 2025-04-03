import { ContainerModule } from 'inversify'
import { SHARED_TYPES } from './types'
import {
    AdapterApiRequest,
    AdapterMail,
    AdapterMongoDB,
    AdapterRabbitMQ,
    AdapterRedis,
    AdapterSocket,
    AdapterToken
} from '../Adapters'
import { database_logiflow } from '../config'
import { Worker } from '../module.worker'
import { UseCaseSendMailRegisterUser } from '../../Application'
import { prefix_col_root } from 'logiflowerp-sdk'
import { Bootstraping } from '@Shared/Bootstraping'
import { BootstrapingDatabaseMongo } from '@Shared/Bootstraping/database'

export const containerModule = new ContainerModule(bind => {
    bind(SHARED_TYPES.AdapterToken).to(AdapterToken).inSingletonScope()
    bind(SHARED_TYPES.AdapterMongoDB).to(AdapterMongoDB).inSingletonScope()
    bind(SHARED_TYPES.AdapterSocket).to(AdapterSocket).inSingletonScope()
    bind(SHARED_TYPES.AdapterRedis).to(AdapterRedis).inSingletonScope()
    bind(SHARED_TYPES.AdapterMail).to(AdapterMail).inSingletonScope()
    bind(SHARED_TYPES.AdapterApiRequest).to(AdapterApiRequest).inSingletonScope()
    bind(SHARED_TYPES.AdapterRabbitMQ).to(AdapterRabbitMQ).inSingletonScope()
    bind(SHARED_TYPES.UseCaseSendMailRegisterUser).to(UseCaseSendMailRegisterUser)
    bind(SHARED_TYPES.database_logiflow).toConstantValue(database_logiflow)
    bind(SHARED_TYPES.prefix_col_root).toConstantValue(prefix_col_root)
    bind(Worker).to(Worker).inSingletonScope()
    bind(SHARED_TYPES.BootstrapingDatabaseMongo).to(BootstrapingDatabaseMongo)
    bind(SHARED_TYPES.Bootstraping).to(Bootstraping)
})