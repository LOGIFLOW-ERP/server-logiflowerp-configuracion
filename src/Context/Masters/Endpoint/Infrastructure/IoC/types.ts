export const ENDPOINT_TYPES = {
    MongoRepository: Symbol.for(`${__dirname}MongoRepository`),
    UseCaseFind: Symbol.for(`${__dirname}UseCaseFind`),
    UseCaseSaveRoutes: Symbol.for(`${__dirname}UseCaseSaveRoutes`),
}