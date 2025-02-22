import { ENDPOINT_TYPES } from '@Masters/Endpoint/Infrastructure/IoC/types'
import { ContainerGlobal } from './inversify'
import { UseCaseSaveRoutes } from '@Masters/Endpoint/Application'
import { getRouteInfo } from 'inversify-express-utils'
import { UseCaseSave } from '@Masters/OpcionSistema/Application'
import { OPCION_SISTEMA_TYPES } from '@Masters/OpcionSistema/Infrastructure/IoC'
import { env } from './env'

export async function registerRoutes(rootPath: string) {
    const routes = getRouteInfo(ContainerGlobal)
    try {
        await ContainerGlobal.get<UseCaseSaveRoutes>(ENDPOINT_TYPES.UseCaseSaveRoutes).exec(routes, rootPath)
        await ContainerGlobal.get<UseCaseSave>(OPCION_SISTEMA_TYPES.UseCaseSave).exec(routes, env.PREFIX)
    } catch (error) {
        console.error(error)        
        process.exit(1)
    }
}