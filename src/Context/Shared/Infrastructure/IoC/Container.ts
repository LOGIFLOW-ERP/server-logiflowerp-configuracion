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
import {
    collection_endpoint,
    collection_user,
    database_test
} from '../config'
import { Worker } from '../module.worker'
import { UseCaseSendMailRegisterUser } from '../../Application'

export const containerModule = new ContainerModule(bind => {
    bind(SHARED_TYPES.AdapterToken).to(AdapterToken).inSingletonScope()
    bind(SHARED_TYPES.AdapterMongoDB).to(AdapterMongoDB).inSingletonScope()
    bind(SHARED_TYPES.AdapterSocket).to(AdapterSocket).inSingletonScope()
    bind(SHARED_TYPES.AdapterRedis).to(AdapterRedis).inSingletonScope()
    bind(SHARED_TYPES.AdapterMail).to(AdapterMail).inSingletonScope()
    bind(SHARED_TYPES.AdapterApiRequest).to(AdapterApiRequest).inSingletonScope()
    bind(SHARED_TYPES.AdapterRabbitMQ).to(AdapterRabbitMQ).inSingletonScope()
    bind(SHARED_TYPES.UseCaseSendMailRegisterUser).to(UseCaseSendMailRegisterUser)
    bind(SHARED_TYPES.database_test).toConstantValue(database_test)
    bind(SHARED_TYPES.collection_user).toConstantValue(collection_user)
    bind(SHARED_TYPES.collection_endpoint).toConstantValue(collection_endpoint)
    bind(Worker).to(Worker).inSingletonScope()
})