import { ContainerGlobal } from './inversify'
import { getRouteInfo } from 'inversify-express-utils'
import { env } from './env'
import { RootSystemOptionMongoRepository } from '@Masters/RootSystemOption/Infrastructure/MongoRepository'
import { SHARED_TYPES } from '@Shared/Infrastructure'
import { UseCaseSave } from '@Masters/RootSystemOption/Application'

export async function registerRoutes(rootPath: string) {
    const routes = getRouteInfo(ContainerGlobal)
    try {
        const prefix_col_root = ContainerGlobal.get<string>(SHARED_TYPES.prefix_col_root)
        const repository = new RootSystemOptionMongoRepository(prefix_col_root)
        await new UseCaseSave(repository).exec(routes, rootPath, env.PREFIX)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}