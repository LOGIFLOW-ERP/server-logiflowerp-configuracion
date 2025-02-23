import { inject, injectable } from 'inversify'
import { SYSTEM_OPTION_TYPES } from '../Infrastructure/IoC/types'
import { ISystemOptionMongoRepository } from '../Domain'
import { RouteInfo } from 'inversify-express-utils'
import { UnprocessableEntityException } from '@Config'
import { builSystemOption } from 'logiflowerp-sdk'

@injectable()
export class UseCaseSave {

    constructor(
        @inject(SYSTEM_OPTION_TYPES.MongoRepository) private readonly repository: ISystemOptionMongoRepository,
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