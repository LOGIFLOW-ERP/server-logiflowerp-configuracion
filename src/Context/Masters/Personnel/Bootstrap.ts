import { IndexEntity } from '@Shared/Domain'
import { collection, database } from './Infrastructure/config'
import { Bootstraping } from '@Shared/Bootstraping'
import { EmployeeENTITY, RootCompanyENTITY } from 'logiflowerp-sdk'
import { inject, injectable } from 'inversify'
import { SHARED_TYPES } from '@Shared/Infrastructure'

@injectable()
export class ManagerEntity {

    private indexes: IndexEntity<EmployeeENTITY>[] = [
        {
            campos: { identity: 1 },
            opciones: { name: 'idx_identity', unique: true }
        },
        {
            campos: { email: 1 },
            opciones: { name: 'idx_email', unique: true }
        }
    ]

    constructor(
        @inject(SHARED_TYPES.Bootstraping) private bootstrap: Bootstraping
    ) { }

    async exec(rootCompanies: RootCompanyENTITY[]) {
        for (const company of rootCompanies) {
            const db = database
            const col = `${company.code}_${collection}`

            console.info(`➽  Configurando ${col} en ${db} ...`)
            await this.bootstrap.exec(db, col, this.indexes)
            console.info(`➽  Configuración de ${col} en ${db} completada`)
        }
    }

}