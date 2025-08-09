import { loggerService } from './logger.service.js'
import { makeId, readJsonFile, writeJsonFile } from './util.service.js'

const users = readJsonFile('./data/user.json')

export const userService = {
  add,
  query,
  getById,
  remove,
}

function query() {
  return Promise.resolve(users)
}

function getById(userId) {
  let user = users.find((user) => user._id === userId)

  if (!user) {
    loggerService.error(`Couldnt find user ${userId} in userService`)
    return Promise.reject(`Couldnt get user`)
  }

  user = { ...user }
  delete user.password
  return Promise.resolve(user)
}

function remove(userId) {
  const user = users.find((user) => user._id === userId)
  if (!user) {
    loggerService.error(`Couldnt find user ${userId} in userService`)
    return Promise.reject(`Couldnt remove user`)
  }

  users.splice(user, 1)
  _saveUsers()
  return Promise.resolve(user)
}

function add(user) {
  //check if user exists by username...
  const newUser = _isUserExist(user)
  if (newUser) {
    return Promise.reject('User Exists!')
  }
  user._id = makeId()
  users.push(user)

  return _saveUsers().then(() => {
    delete user.password
    return user
  })
}

function _isUserExist(searchUser) {
  const userToFind = users.find((user) => user.username === searchUser.username)
  console.log(userToFind)
  if (userToFind) {
    return userToFind
  }
}

function _saveUsers() {
  return writeJsonFile('./data/user.json', users)
}
