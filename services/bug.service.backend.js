import { loggerService } from './logger.service.js'
import { makeId, readJsonFile, writeJsonFile } from './util.service.js'

const bugs = readJsonFile('./data/bug.json')

export const bugService = {
  query,
  getById,
  remove,
  save,
  getEmptyBug
}

function query(filterBy={},sort={},page={}) {
  let bugsToDisplay = bugs

     if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        bugsToDisplay = bugsToDisplay.filter((bug) => regExp.test(bug.title))
     }
      if (filterBy.minSeverity) {
        bugsToDisplay = bugsToDisplay.filter((bug) => bug.severity >= filterBy.minSeverity)
      }
      if (filterBy.labels) {
        const regExp = new RegExp(filterBy.labels, 'i')
        bugsToDisplay = bugsToDisplay.filter((bug) => regExp.test(bug.labels))

      }
      if (sort.sortBy==='title') {
        bugsToDisplay=bugsToDisplay.sort((a, b) => a.title.localeCompare(b.title) * sort.sortDir);
      }

       if (sort.sortBy==='severity') {
        bugsToDisplay=bugsToDisplay.sort((a, b) => (a.severity-b.severity)* sort.sortDir);
      }

       if (sort.sortBy==='createdAt') {
        bugsToDisplay=bugsToDisplay.sort((a, b) => (a.createdAt-b.createdAt)* sort.sortDir);
      }


    

    // let BUGS_PER_PAGE = 4
    // let totalPages = Math.ceil(bugsToDisplay.length / BUGS_PER_PAGE)

    // if (page.pageIdx<0) page.pageIdx = totalPages-1
    // if (page.pageIdx>=totalPages) page.pageIdx  = 0 

    // let startIndex = page.pageIdx*BUGS_PER_PAGE
    // const endIndex = startIndex+BUGS_PER_PAGE

   

    // bugsToDisplay=bugsToDisplay.slice(startIndex,endIndex)



  

      return Promise.resolve(bugsToDisplay)
}

function save(bugToSave,loggedinUser) {
  if (bugToSave._id) {
    const idx = bugs.findIndex((bug) => bug._id === bugToSave._id)

    if (idx === -1) {
      loggerService.error(`Couldnt find bug ${bugToSave._id} in bugService`)
      return Promise.reject(`Couldnt save bug`)
    }
    bugToSave = { ...bugs[idx], ...bugToSave}
    bugs.splice(idx, 1, bugToSave)
  } else {
    bugToSave._id = makeId()
    bugToSave.creator=loggedinUser
    bugs.push(bugToSave)
  }
  console.log('bug was save')
  return _saveBugs().then(() => bugToSave)
}

function getById(bugId) {
  const bug = bugs.find((bug) => bug._id === bugId)

  if (!bug) {
    loggerService.error(`Couldnt find bug ${bugId} in bugService`)
    return Promise.reject(`Couldnt get bug`)
  }
  return Promise.resolve(bug)
}

function remove(bugId) {

  const bug = bugs.find((bug) => bug._id === bugId)
  if (!bug) {
    loggerService.error(`Couldnt find bug ${bugId} in bugService`)
    return Promise.reject(`Couldnt get bug`)
  }
  bugs.splice(bug, 1)
  _saveBugs()
  return Promise.resolve(bug)
}
function _saveBugs() {
  return writeJsonFile('./data/bug.json', bugs)
}


function getEmptyBug({title,description,severity,labels}) {
  return {
    title: title || '',
    description:description || '',
    severity:severity || '',
    createdAt :  new Date().getTime(),
    labels:labels || [], 
  }
}