import { inject, injectable } from 'inversify'
import { SYSTEM_OPTION_TYPES } from '../Infrastructure/IoC/types'
import { ISystemOptionMongoRepository } from '../Domain'
import { RouteInfo } from 'inversify-express-utils'
import { UnprocessableEntityException } from '@Config'
import { SystemOptionENTITY, validateCustom } from 'logiflowerp-sdk'

@injectable()
export class UseCaseSave {

    constructor(
        @inject(SYSTEM_OPTION_TYPES.MongoRepository) private readonly repository: ISystemOptionMongoRepository,
    ) { }

    async exec(rawData: RouteInfo[], rootPath: string, prefix: string) {
        const dataDB = await this.repository.select([])
        const dataDBSet = new Set(dataDB.map(e => e.key))
        const mapaLocal = new Set<string>()
        const newData: SystemOptionENTITY[] = []

        for (const raw of rawData) {
            for (const endpoint of raw.endpoints) {
                const partsRoute = `/${prefix}${endpoint.route.split(' ')[1]}`.split('/')

                for (const [i, element] of partsRoute.entries()) {
                    if (!element) continue

                    const father = partsRoute[i - 1]
                    const key = `${element}|${father}|${prefix}`

                    if (mapaLocal.has(key)) continue
                    mapaLocal.add(key)

                    if (!dataDBSet.has(key)) {
                        const _newEntity = new SystemOptionENTITY()
                        _newEntity.father = father
                        _newEntity.name = this.separarPalabras(element)
                        _newEntity.prefix = prefix
                        if (i === partsRoute.length - 1) {
                            const [method, pathParts] = endpoint.route.split(' ')
                            _newEntity.route = `${method} ${rootPath}${pathParts}`
                        }
                        const newItem = await validateCustom(_newEntity, SystemOptionENTITY, UnprocessableEntityException)
                        newData.push(newItem)
                    }
                }
            }
        }

        const _ids = dataDB.filter(e => !mapaLocal.has(e.key)).map(e => e._id)

        if (_ids.length) {
            await this.repository.deleteMany({ _id: { $in: _ids } })
        }

        if (newData.length) {
            await this.repository.insertMany(newData)
        }
    }

    separarPalabras(texto: string) {
        return texto
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    }

}