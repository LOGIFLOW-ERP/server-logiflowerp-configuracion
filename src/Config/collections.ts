import { Dirent, globSync } from 'fs'
import path from 'path'
import { RootCompanyMongoRepository } from '@Masters/RootCompany/Infrastructure/MongoRepository'
import { State } from 'logiflowerp-sdk'
import { ContainerGlobal } from './inversify'
import { ROOT_COMPANY_TYPES } from '@Masters/RootCompany/Infrastructure/IoC'

async function getRootCompanies() {
    const repository = ContainerGlobal.get<RootCompanyMongoRepository>(ROOT_COMPANY_TYPES.RepositoryMongo)
    const pipeline = [{ $match: { state: State.ACTIVO } }]
    return repository.select(pipeline)
}

async function initcollection(paths: Dirent[]) {
    const rootCompanies = await getRootCompanies()
    for (let rute of paths) {
        const newPath = path.join('../', `${rute.parentPath.split('src')[1]}/${rute.name}`)
        const { ManagerEntity } = await import(newPath)
        const instance = ContainerGlobal.resolve<any>(ManagerEntity)
        await instance.exec(rootCompanies)
    }
}

export const initCollections = async () => {
    const cwd = path.resolve(__dirname, '../Context')
    const paths = globSync(['**/Bootstrap.js', '**/Bootstrap.ts'], { withFileTypes: true, cwd })
    await initcollection(paths)
}