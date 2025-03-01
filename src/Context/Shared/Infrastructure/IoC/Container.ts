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
    collection_profiles,
    collection_systemOptions,
    collection_user,
    database_logiflow
} from '../config'
import { Worker } from '../module.worker'
import { UseCaseSendMailRegisterUser } from '../../Application'
import { collections } from 'logiflowerp-sdk'

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
    bind(SHARED_TYPES.collection_user).toConstantValue(collection_user)
    bind(SHARED_TYPES.collection_endpoint).toConstantValue(collection_endpoint)
    bind(SHARED_TYPES.collection_systemOptions).toConstantValue(collection_systemOptions)
    bind(SHARED_TYPES.collection_profiles).toConstantValue(collection_profiles)
    bind(SHARED_TYPES.collection_currencies).toConstantValue(collections.currencies)
    bind(SHARED_TYPES.collection_productPrices).toConstantValue(collections.productPrices)
    bind(Worker).to(Worker).inSingletonScope()
})