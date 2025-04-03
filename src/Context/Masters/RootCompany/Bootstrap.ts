import { IndexEntity } from '@Shared/Domain'
import { collection, database } from './Infrastructure/config'
import { Bootstraping } from '@Shared/Bootstraping'
import { prefix_col_root, RootCompanyENTITY } from 'logiflowerp-sdk'
import { inject, injectable } from 'inversify'
import { SHARED_TYPES } from '@Shared/Infrastructure'

@injectable()
export class ManagerEntity {

    private database = database
    private collection = `${prefix_col_root}_${collection}`
    private indexes: IndexEntity<RootCompanyENTITY>[] = [
        {
            campos: { ruc: 1 },
            opciones: { name: 'idx_ruc', unique: true }
        },
        {
            campos: { code: 1 },
            opciones: { name: 'idx_code', unique: true }
        }
    ]

    constructor(
        @inject(SHARED_TYPES.Bootstraping) private bootstrap: Bootstraping
    ) { }

    async exec() {
        console.info(`➽  Configurando ${this.collection} en ${this.database} ...`)
        await this.bootstrap.exec(this.database, this.collection, this.indexes)
        console.info(`➽  Configuración de ${this.collection} en ${this.database} completada`)
    }

}