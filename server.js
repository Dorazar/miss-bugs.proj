import express from 'express'
import { json } from 'stream/consumers'
import { bugService} from './services/bug.service.js'
 const app = express() 




 app.get('/api/bug', (req, res) => 
    bugService.query().
    then(bugs => res.send(bugs))

)











 
 app.listen(3030, () => console.log('Server ready at port 3030'))