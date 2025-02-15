import { ContainerModule } from 'inversify'
import { SHARED_TYPES } from './types'
import {
    AdapterMongoDB,
    AdapterRedis,
    AdapterSocket,
    AdapterToken
} from '../Adapters'
import {
    collection_endpoint,
    collection_user,
    database_test
} from '../config'

export const containerModule = new ContainerModule(bind => {
    bind(SHARED_TYPES.AdapterToken).to(AdapterToken).inSingletonScope()
    bind(SHARED_TYPES.AdapterMongoDB).to(AdapterMongoDB).inSingletonScope()
    bind(SHARED_TYPES.AdapterSocket).to(AdapterSocket).inSingletonScope()
    bind(SHARED_TYPES.AdapterRedis).to(AdapterRedis).inSingletonScope()
    bind(SHARED_TYPES.database_test).toConstantValue(database_test)
    bind(SHARED_TYPES.collection_user).toConstantValue(collection_user)
    bind(SHARED_TYPES.collection_endpoint).toConstantValue(collection_endpoint)
})