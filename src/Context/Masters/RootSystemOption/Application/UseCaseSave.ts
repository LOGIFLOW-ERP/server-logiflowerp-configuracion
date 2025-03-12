import { IRootSystemOptionMongoRepository } from '../Domain'
import { RouteInfo } from 'inversify-express-utils'
import { UnprocessableEntityException } from '@Config/exception'
import { builSystemOption } from 'logiflowerp-sdk'

export class UseCaseSave {

    constructor(
        private readonly repository: IRootSystemOptionMongoRepository,
    ) { }

    async exec(rawData: RouteInfo[], rootPath: string, prefix: string) {
        const dataDB = await this.repository.select([{ $match: { prefix } }])
        const { _ids, newData } = await builSystemOption({
            dataDB,
            prefix,
            rawData,
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