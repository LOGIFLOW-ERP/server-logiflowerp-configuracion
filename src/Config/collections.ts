import { Dirent, globSync } from 'fs'
import path from 'path'

async function initcollection(paths: Dirent[]) {
    const managers: Array<any> = []
    for (let rute of paths) {
        const newPath = path.join('../', `${rute.parentPath.split('src')[1]}/${rute.name}`)
        const { ManagerEntity } = await import(newPath)
        const app = new ManagerEntity()
        managers.push(app.exec())
    }
    return managers
}

export const initCollections = async () => {
    const cwd = path.resolve(__dirname, '../Context')
    const paths = globSync(['**/Bootstrap.js', '**/Bootstrap.ts'], { withFileTypes: true, cwd })
    const managers = await initcollection(paths)
    return await Promise.all(managers)
}