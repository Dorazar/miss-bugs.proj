import express from 'express'

import { bugService } from './services/bug.service.backend.js'
import cookieParser from 'cookie-parser'


const app = express()
app.use(express.static('public'))
app.use(cookieParser())
app.get('/api/bug/', (req, res) => bugService.query().then((bugs) => res.send(bugs)))

app.get('/api/bug/save', (req, res) => {
  const { title,_id,severity,description} = req.query
  
  console.log(req.query)
  const bugToSave = {
    _id,
    title,
    description,
    severity:+severity,
    createdAt:new Date()
  }

  bugService
    .save(bugToSave)
    .then((savedBug) => res.send(savedBug))
    .catch((err) => {
      loggerService.error(err)
      res.status(400).send(err)
    })
})

app.get('/api/bug/:bugId', (req, res) => {

  const bugId = req.params.bugId

const cookie = req.cookies.visitedBugs || '[]' 
const visitedBugs = JSON.parse(cookie)

if (!visitedBugs.includes(bugId) && visitedBugs.length<3) {
  visitedBugs.push(bugId)
}

const visitedBugsJson = JSON.stringify(visitedBugs)
res.cookie('visitedBugs', visitedBugsJson, { maxAge: 7000 })



  bugService
    .getById(bugId)
    .then((bug) => res.send(bug))
    .catch((err) => {
      loggerService.error(err)
      res.status(400).send(err)
    })
})

app.get('/api/bug/:bugId/remove', (req, res) => {
  const bugId = req.params.bugId
  bugService
    .remove(bugId)
    .then((bug) => res.send(bug))
    .catch((err) => {
      loggerService.error(err)
      res.status(400).send(err)
    })
})


app.listen(3030, () => console.log('Server ready at http://10.100.102.4:3030'))
