import { inject, injectable } from 'inversify'
import { OPCION_SISTEMA_TYPES } from '../Infrastructure/IoC/types'
import { IOpcionSistemaMongoRepository } from '../Domain'
import { RouteInfo } from 'inversify-express-utils'
import { UnprocessableEntityException } from '@Config'
import { OpcionSistemaENTITY, validateCustom } from 'logiflowerp-sdk'

@injectable()
export class UseCaseSave {

    constructor(
        @inject(OPCION_SISTEMA_TYPES.MongoRepository) private readonly repository: IOpcionSistemaMongoRepository,
    ) { }

    async exec(rawData: RouteInfo[], prefix: string) {
        const dataDB = await this.repository.select([])
        const dataDBSet = new Set(dataDB.map(e => e.key))
        const mapaLocal = new Set<string>()
        const newData: OpcionSistemaENTITY[] = []

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
                        const _newEntity = new OpcionSistemaENTITY()
                        _newEntity.father = father
                        _newEntity.name = element
                        _newEntity.prefix = prefix
                        const newItem = await validateCustom(_newEntity, OpcionSistemaENTITY, UnprocessableEntityException)
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

}