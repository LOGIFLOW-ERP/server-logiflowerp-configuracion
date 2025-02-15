import { Request, Response } from 'express'
import { Collection, Document, MongoClient } from 'mongodb'

export interface IFind {
    collection: Collection
    pipeline: Document[]
    res: Response
    req: Request
    key?: string
}