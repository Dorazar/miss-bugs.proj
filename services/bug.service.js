import { loggerService } from './logger.service.js'
import { makeId, readJsonFile, writeJsonFile } from './util.service.js'

const bugs = readJsonFile('./data/bug.json')


export const bugService = {
    query,
    // getById,
    // remove,
    // save,
}

function query() {
    return Promise.resolve(bugs)
}