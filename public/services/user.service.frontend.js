import axios from "axios"

const BASE_URL = '/api/user/'

export const userService = {
    query,
    getById,
    getEmptyCredentials,
    add

}

function query() {
    return axios.get(BASE_URL).then(res => res.data)
}

function getById(userId) {
    return axios.get(BASE_URL+userId).then(res => res.data)
}

function add(){
return axios.post(BASE_URL).then(res=>res.data)
}


function getEmptyCredentials() {
    return {
        username:'',
        password:'',
        fullname:'',
        isAdmin:false
    }
}

