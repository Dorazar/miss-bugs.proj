import axios from "axios"

const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'
const BASE_URL='/api/auth'

export const authService = {
    login,
    getLoggedinUser,
    logout,
    signup
}

function login(user) {
   return axios.post(BASE_URL+'/login',user)
    .then(res=>res.data)
    .then(_setLoggedinUser)
}

function signup(user) {
   return   axios.post(BASE_URL+'/signup',user)
    .then(res=>res.data)
    .then(_setLoggedinUser)
}

function logout() {
    return axios.post(BASE_URL + '/logout')
        .then(() => sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER))
}

function _setLoggedinUser(user) {
    const {_id,fullname,isAdmin,username} = user
   
    const userToSave = {_id,fullname,isAdmin,username}
    // console.log('userToSave:',userToSave)
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER,JSON.stringify(userToSave))
    return userToSave
}


function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}