import { IndexEntity } from '@Shared/Domain'
import { collection } from './Infrastructure/config'
import { Bootstraping } from '@Shared/Bootstraping'
import { EmployeeENTITY, RootCompanyENTITY } from 'logiflowerp-sdk'
import { inject, injectable } from 'inversify'
import { SHARED_TYPES } from '@Shared/Infrastructure'

@injectable()
export class ManagerEntity {

    private indexes: IndexEntity<EmployeeENTITY>[] = [
        {
            campos: { identity: 1, isDeleted: 1 },
            opciones: {
                name: 'idx_identity_unique_not_deleted',
                unique: true,
                partialFilterExpression: { isDeleted: false }
            }
        },
        {
            campos: { email: 1, isDeleted: 1 },
            opciones: {
                name: 'idx_email_unique_not_deleted',
                unique: true,
                partialFilterExpression: { isDeleted: false }
            }
        }
    ]

    constructor(
        @inject(SHARED_TYPES.Bootstraping) private bootstrap: Bootstraping
    ) { }

    async exec(rootCompanies: RootCompanyENTITY[]) {
        for (const company of rootCompanies) {
            const db = company.code
            const col = collection

            console.info(`➽  Configurando ${col} en ${db} ...`)
            await this.bootstrap.exec(db, col, this.indexes)
            console.info(`➽  Configuración de ${col} en ${db} completada`)
        }
    }

}