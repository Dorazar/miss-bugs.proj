import express from 'express'
import { json } from 'stream/consumers'
import { bugService } from './services/bug.service.js'



const app = express()
app.use(express.static('public'))

app.get('/api/bug/', (req, res) => bugService.query().then((bugs) => res.send(bugs)))

app.get('/api/bug/save', (req, res) => {
  const { title,_id,severity,description} = req.query
  
  console.log(req.query)
  const bugToSave = {
    _id,
    title,
    severity,
    description,
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
    console.log(req.params)
  const bugId = req.params.bugId
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


app.listen(3030, () => console.log('Server ready at port 3030'))
