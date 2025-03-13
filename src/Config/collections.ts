import { Dirent, globSync } from 'fs'
import path from 'path'
import { RootCompanyMongoRepository } from '@Masters/RootCompany/Infrastructure/MongoRepository'
import { prefix_col_root, State } from 'logiflowerp-sdk'

async function getRootCompanies() {
    const repository = new RootCompanyMongoRepository(prefix_col_root)
    const pipeline = [{ $match: { state: State.ACTIVO } }]
    return repository.select(pipeline)
}

async function initcollection(paths: Dirent[]) {
    const rootCompanies = await getRootCompanies()
    for (let rute of paths) {
        const newPath = path.join('../', `${rute.parentPath.split('src')[1]}/${rute.name}`)
        const { ManagerEntity } = await import(newPath)
        const app = new ManagerEntity()
        await app.exec(rootCompanies)
    }
}

export const initCollections = async () => {
    const cwd = path.resolve(__dirname, '../Context')
    const paths = globSync(['**/Bootstrap.js', '**/Bootstrap.ts'], { withFileTypes: true, cwd })
    await initcollection(paths)
}