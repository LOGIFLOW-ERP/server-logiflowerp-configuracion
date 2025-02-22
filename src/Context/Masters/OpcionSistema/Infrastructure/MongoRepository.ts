import { MongoRepository, SHARED_TYPES } from '@Shared/Infrastructure'
import { IOpcionSistemaMongoRepository } from '../Domain'
import { inject, injectable } from 'inversify'
import { OpcionSistemaENTITY } from 'logiflowerp-sdk'

@injectable()
export class EndpointMongoRepository extends MongoRepository<OpcionSistemaENTITY> implements IOpcionSistemaMongoRepository {

    constructor(
        @inject(SHARED_TYPES.database_test) database: string,
        @inject(SHARED_TYPES.collection_opcionSistema) collection: string,
    ) {
        super(database, collection)
    }

}