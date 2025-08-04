import express from 'express'

import { bugService } from './services/bug.service.backend.js'
import cookieParser from 'cookie-parser'

const app = express()
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

app.get('/api/bug', (req, res) => {
  const filterBy = {
    txt: req.query.txt,
    minSeverity: +req.query.minSeverity,
    labels:req.query.labels
  }

 const sort = {
  sortBy:req.query.sortBy,
  sortDir:req.query.sortDir || -1
 }
  
  

    console.log(sort)
   
  bugService.query(filterBy,sort).then((bugs) => res.send(bugs))
})


// create / edit

app.post('/api/bug', (req, res) => {

  console.log(req.query)
  const bugToSave = {
    _id:req.query._id,
    title:req.query.title,
    description:req.query.description,
    severity: +req.query.severity,
    createdAt: new Date().getTime(),
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

  if (!visitedBugs.includes(bugId) && visitedBugs.length < 3) {
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
