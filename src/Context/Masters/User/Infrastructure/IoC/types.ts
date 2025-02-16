export const USER_TYPES = {
    MongoRepository: Symbol.for(`${__dirname}MongoRepository`),
    UseCaseFind: Symbol.for(`${__dirname}UseCaseFind`),
    // UseCaseInsertOne: Symbol.for(`${__dirname}UseCaseInsertOne`),
    UseCaseUpdateOne: Symbol.for(`${__dirname}UseCaseUpdateOne`),
}