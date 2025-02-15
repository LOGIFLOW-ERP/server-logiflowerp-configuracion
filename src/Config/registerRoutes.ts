import { ENDPOINT_TYPES } from '@Masters/Endpoint/Infrastructure/IoC/types'
import { ContainerGlobal } from './inversify'
import { UseCaseSaveRoutes } from '@Masters/Endpoint/Application'
import { getRouteInfo } from 'inversify-express-utils'

export async function registerRoutes(rootPath: string) {
    const routes = getRouteInfo(ContainerGlobal)
    await ContainerGlobal.get<UseCaseSaveRoutes>(ENDPOINT_TYPES.UseCaseSaveRoutes).exec(routes, rootPath)
}