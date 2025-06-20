import { IndexEntity } from '@Shared/Domain'
import { collection } from './Infrastructure/config'
import { Bootstraping } from '@Shared/Bootstraping'
import { RootCompanyENTITY } from 'logiflowerp-sdk'
import { inject, injectable } from 'inversify'
import { SHARED_TYPES } from '@Shared/Infrastructure'
import { CONFIG_TYPES } from '@Config/types'

@injectable()
export class ManagerEntity {

    private database = this.env.DB_ROOT
    private collection = collection
    private indexes: IndexEntity<RootCompanyENTITY>[] = [
        {
            campos: { ruc: 1, isDeleted: 1 },
            opciones: {
                name: 'idx_ruc_unique_not_deleted',
                unique: true,
                partialFilterExpression: { isDeleted: false }
            }
        },
        {
            campos: { code: 1, isDeleted: 1 },
            opciones: {
                name: 'idx_code_unique_not_deleted',
                unique: true,
                partialFilterExpression: { isDeleted: false }
            }
        }
    ]

    constructor(
        @inject(SHARED_TYPES.Bootstraping) private bootstrap: Bootstraping,
        @inject(CONFIG_TYPES.Env) private env: Env,
    ) { }

    async exec() {
        console.info(`➽  Configurando ${this.collection} en ${this.database} ...`)
        await this.bootstrap.exec(this.database, this.collection, this.indexes)
        console.info(`➽  Configuración de ${this.collection} en ${this.database} completada`)
    }

}