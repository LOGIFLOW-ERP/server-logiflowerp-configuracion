import { IndexEntity } from '@Shared/Domain'
import { collection } from './Infrastructure/config'
import { Bootstraping } from '@Shared/Bootstraping'
import { SystemOptionENTITY } from 'logiflowerp-sdk'
import { inject } from 'inversify'
import { SHARED_TYPES } from '@Shared/Infrastructure'
import { CONFIG_TYPES } from '@Config/types'

export class ManagerEntity {

    private database = this.env.DB_ROOT
    private collection = collection
    private indexes: IndexEntity<SystemOptionENTITY>[] = [
        {
            campos: { key: 1, root: 1 },
            opciones: { name: 'idx_key_root', unique: true }
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