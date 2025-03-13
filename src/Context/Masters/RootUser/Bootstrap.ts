import { IndexEntity } from '@Shared/Domain'
import { collection, database } from './Infrastructure'
import { Bootstraping } from '@Shared/Bootstraping'
import { prefix_col_root } from 'logiflowerp-sdk'

export class ManagerEntity {

    private bootstrap: Bootstraping
    private database = database
    private collection = `${prefix_col_root}_${collection}`
    private indexes: IndexEntity[] = [
        {
            campos: [
                { nombre: 'identity', direccion: 1 }
            ],
            opciones: { name: `idx_identity`, unique: true }
        },
        {
            campos: [
                { nombre: 'email', direccion: 1 }
            ],
            opciones: { name: `idx_email`, unique: true }
        }
    ]

    constructor() {
        this.bootstrap = new Bootstraping(this.database, this.collection, this.indexes)
    }

    async exec() {
        console.info(`➽  Configurando ${this.collection} en ${this.database} ...`)
        await this.bootstrap.exec()
        console.info(`➽  Configuración de ${this.collection} en ${this.database} completada`)
    }

}