import { inject, injectable } from 'inversify'
import { ENDPOINT_TYPES } from '../Infrastructure'
import { IEndpointMongoRepository } from '../Domain'
import { RouteInfo } from 'inversify-express-utils'
import { EndpointENTITY } from 'logiflowerp-sdk'

@injectable()
export class UseCaseSaveRoutes {

    constructor(
        @inject(ENDPOINT_TYPES.MongoRepository) private repository: IEndpointMongoRepository
    ) { }

    async exec(rawData: RouteInfo[], rootPath: string) {
        const transformedData: EndpointENTITY[] = rawData.map(data => ({
            _id: crypto.randomUUID(),
            controller: data.controller,
            endpoints: data.endpoints.map(endpoint => {
                const [method, pathParts] = endpoint.route.split(' ')
                return {
                    method,
                    route: `${rootPath}${pathParts}`.toLowerCase()
                }
            })
        }))
        await this.repository.save(transformedData)
    }

}