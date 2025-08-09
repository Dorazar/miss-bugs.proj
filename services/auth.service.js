import Cryptr from 'cryptr'
import { userService } from './user.service.backend.js'

const cryptr = new Cryptr('secret-puk-1234')


export  const authService ={
    getLoginToken,
    checkLogin,
    validateToken

}


function checkLogin({username,password}) {
    
    return userService.getByUsername(username)
    .then(user =>{
        if(user && user.password===password) {
            user = {...user}
            delete user.password
            return Promise.resolve(user)
        }
        return Promise.reject('Cannot login!')
    })

}

function getLoginToken(user) {
    const loginToker =  cryptr.encrypt(JSON.stringify(user))
    if (loginToker) {
        return Promise.resolve(loginToker)
    }
    else {
        return Promise.reject(loginToker)
    }
}

function validateToken(loginToken) {
    const json = cryptr.decrypt(loginToken)
    const loggedinUser = JSON.parse(json)
    return loggedinUser
}