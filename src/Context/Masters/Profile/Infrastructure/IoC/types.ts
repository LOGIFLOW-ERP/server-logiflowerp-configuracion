export const PROFILE_TYPES = {
    MongoRepository: Symbol.for(`${__dirname}MongoRepository`),
    UseCaseFind: Symbol.for(`${__dirname}UseCaseFind`),
    UseCaseSave: Symbol.for(`${__dirname}UseCaseSave`),
}