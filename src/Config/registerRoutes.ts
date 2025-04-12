import { ContainerGlobal } from './inversify'
import { getRouteInfo } from 'inversify-express-utils'
import { env } from './env'
import { UseCaseSave } from '@Masters/RootSystemOption/Application'
import { ROOT_SYSTEM_OPTION_TYPES } from '@Masters/RootSystemOption/Infrastructure/IoC'

export async function registerRoutes(rootPath: string) {
    const routes = getRouteInfo(ContainerGlobal)
    try {
        const useCaseSave = ContainerGlobal.get<UseCaseSave>(ROOT_SYSTEM_OPTION_TYPES.UseCaseSave)
        await useCaseSave.exec(routes, rootPath, env.PREFIX)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}