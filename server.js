import express from 'express'

import { bugService } from './services/bug.service.backend.js'
import {userService} from './services/user.service.backend.js'
import cookieParser from 'cookie-parser'
import { loggerService } from './services/logger.service.js'

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
  sortDir:req.query.sortDir 
 }


const page =  {
  pageIdx:+req.query.pageIdx || 0
}
   
  bugService.query(filterBy,sort,page).then((bugs) => res.send(bugs))
})

// create / edit

app.post('/api/bug', (req, res) => {

  console.log(req.body)
  const bugToSave = {
    title:req.body.title,
    description:req.body.description,
    severity: +req.body.severity,
    createdAt: new Date().getTime(),
    labels:req.body.labels
  }

  const bug= bugService.getEmptyBug(req.body)



  bugService
    .save(bug)
    .then((savedBug) => res.send(savedBug))
    .catch((err) => {
      loggerService.error(err)
      res.status(400).send(err)
    })
})


app.put('/api/bug',(req,res) => {
  
  const bugToSave = {
    _id:req.body._id,
    title:req.body.title,
    description:req.body.description,
    severity: +req.body.severity,
    createdAt: new Date().getTime(),
    labels:req.body.labels
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

app.delete('/api/bug/:bugId', (req, res) => {
  const bugId = req.params.bugId
  console.log(bugId)
  bugService
    .remove(bugId)
    .then((bug) => {res.send(bug)})
    .catch((err) => {
      loggerService.error(err)
      res.status(400).send(err)
    })
})



// USERS API

app.get('/api/user/',(req,res) => {
userService.query().then(users => res.send(users))
})

app.get('/api/user/:userId',(req,res) => {
const userId = req.params.userId
userService.getById(userId).then(users => res.send(users))
.catch((err) => {
      loggerService.error(err)
      res.status(400).send(err)
    })
})

app.delete('/api/user/:userId',(req,res)=> {
  let userId = req.params.userId

  userService.remove(userId).then((user => res.send(user)))
  .catch((err)=> {
     loggerService.error(err)
     res.status(400).send(err)
  }
)
})

// USER ADD

app.post('/api/user',(req,res) => {
  
  const user = {
    username:req.body.username,
    fullname:req.body.fullname,
    password:req.body.password,
    isAdmin:req.body.isAdmin,
  }

  userService.add(user).then(user => res.send(user))
  .catch((err)=> {
      loggerService.error(err)
     res.status(400).send(err)
  })

})

app.listen(3030, () => console.log('Server ready at http://10.100.102.4:3030'))
