import fs from "fs";
import path from "path";
import { AuthUserDTO, collections, db_root, RootCompanyENTITY, State, UnitOfMeasureENTITY, validateCustom } from 'logiflowerp-sdk';
import { MongoRepository } from '@Shared/Infrastructure';
import { UnprocessableEntityException } from './exception';

export async function runSeed(_rootCompanies?: RootCompanyENTITY[]) {
    const repository = new MongoRepository<RootCompanyENTITY>(db_root, collections.company, new AuthUserDTO())
    const pipeline = [{ $match: { state: State.ACTIVO, isDeleted: false } }]
    const rootCompanies = _rootCompanies
        ? _rootCompanies
        : await repository.select(pipeline)

    // 🟢 Unidades de Medida
    const unidades: Partial<UnitOfMeasureENTITY>[] = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../../public/unidad_medida.json"), "utf-8")
    );

    for (const company of rootCompanies) {
        const repositoryUM = new MongoRepository<UnitOfMeasureENTITY>(company.code, collections.unitOfMeasure, new AuthUserDTO())
        const data = await repositoryUM.select([{ $match: {} }])
        if (data.length) {
            await repositoryUM.deleteManyReal({})
        }
        const items: UnitOfMeasureENTITY[] = []
        for (const element of unidades) {
            const entity = new UnitOfMeasureENTITY()
            entity.set(element)
            entity._id = crypto.randomUUID()
            items.push(await validateCustom(entity, UnitOfMeasureENTITY, UnprocessableEntityException))
        }
        await repositoryUM.insertMany(items)
    }

    console.log(`✅ Se cargaron ${unidades.length} unidades de medida`);
}
