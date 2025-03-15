import { IRootSystemOptionMongoRepository } from '../Domain'
import { RouteInfo } from 'inversify-express-utils'
import { UnprocessableEntityException } from '@Config/exception'
import { builSystemOption } from 'logiflowerp-sdk'

export class UseCaseSave {

    constructor(
        private readonly repository: IRootSystemOptionMongoRepository,
    ) { }

    async exec(rawData: RouteInfo[], rootPath: string, prefix: string) {
        await this.execRoot(rawData, rootPath, prefix)
        await this.execNoRoot(rawData, rootPath, prefix)
    }

    private async execRoot(rawData: RouteInfo[], rootPath: string, prefix: string) {
        const dataDB = await this.repository.select([{ $match: { prefix, root: true } }])
        const rawDataAux = rawData.filter(e => e.controller.startsWith('Root'))
        const { _ids, newData } = await builSystemOption({
            dataDB,
            prefix,
            rawData: rawDataAux,
            rootPath,
            UnprocessableEntityException,
            root: true
        })
        if (_ids.length) {
            await this.repository.deleteMany({ _id: { $in: _ids } })
        }
        if (newData.length) {
            await this.repository.insertMany(newData)
        }
    }

    private async execNoRoot(rawData: RouteInfo[], rootPath: string, prefix: string) {
        const dataDB = await this.repository.select([{ $match: { prefix, root: false } }])
        const rawDataAux = rawData.filter(e => !e.controller.startsWith('Root'))
        const { _ids, newData } = await builSystemOption({
            dataDB,
            prefix,
            rawData: rawDataAux,
            rootPath,
            UnprocessableEntityException
        })
        if (_ids.length) {
            await this.repository.deleteMany({ _id: { $in: _ids } })
        }
        if (newData.length) {
            await this.repository.insertMany(newData)
        }
    }

}