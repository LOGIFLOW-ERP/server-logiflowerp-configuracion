import { AdapterRedis, MongoRepository, SHARED_TYPES } from '@Shared/Infrastructure'
import { IEndpointMongoRepository } from '../Domain'
import { inject, injectable } from 'inversify'
import { EndpointENTITY } from 'logiflowerp-sdk'

@injectable()
export class EndpointMongoRepository extends MongoRepository<EndpointENTITY> implements IEndpointMongoRepository {

    constructor(
        @inject(SHARED_TYPES.database_logiflow) database: string,
        @inject(SHARED_TYPES.collection_endpoints) collection: string,
        @inject(SHARED_TYPES.AdapterRedis) adapterRedis: AdapterRedis,
    ) {
        super(database, collection)
    }

    async save(data: EndpointENTITY[]) {
        const client = await this.adapterMongo.connection()
        const col = client.db(this.database).collection<EndpointENTITY>(this.collection)
        try {
            const controllers = data.map(item => item.controller)
            const existingDocs = await col.find({ controller: { $in: controllers } }).toArray()

            const existingControllers = new Set(existingDocs.map(doc => doc.controller))

            const newData: EndpointENTITY[] = []
            for (const item of data) {
                if (existingControllers.has(item.controller)) {
                    await col.updateOne(
                        { controller: item.controller },
                        { $set: { endpoints: item.endpoints } }
                    )
                } else {
                    newData.push(item)
                }
            }

            if (newData.length) {
                await col.insertMany(newData)
            }
        } finally {
            await this.adapterRedis.deleteKeysCollection(col)
            // await this.adapterMongo.closeConnection()
        }
    }

}