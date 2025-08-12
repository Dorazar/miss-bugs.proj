import { authService } from '../services/auth.service.frontend.js'
import { userService } from '../services/user.service.frontend.js'
import { showErrorMsg, showUserMsg } from '../services/event-bus.service.js'

const { useState, useEffect } = React
const { useNavigate } = ReactRouterDOM

export function LoginSignup() {
  const [credentials, setCredentials] = useState(userService.getEmptyCredentials())
  const [isSignup, setIsSignup] = useState(false)

  const navigate = useNavigate()

  function onLogOut() {
    authService.logout()
  }
  function handleChange({ target }) {
    const { name: field, value } = target

    setCredentials((prevCreds) => ({ ...prevCreds, [field]: value }))
  }

  function handleSumbit(credentials) {
    isSignup ? signUp(credentials) : login(credentials)
  }

  function signUp(credentials) {
    authService.signup(credentials)
    showUserMsg('Signup successfully')
  }

  function login(credentials) {
    authService.login(credentials)
    showUserMsg('Loggin in successfully')
    // navigate('/bug')
  }

  function onSignChange() {
    setIsSignup(!isSignup)
  }

  return (
    <section>
      <form
        method="post"
        onSubmit={(ev) => {
          ev.preventDefault()
          ev.stopPropagation()
          handleSumbit(credentials)
        }}
      >
        <label htmlFor="username"></label>
        <input onChange={handleChange} type="text" name="username" placeholder="username" />

        <label htmlFor="password"></label>
        <input onChange={handleChange} type="text" name="password" placeholder="password" />

        {isSignup && (
            <span>
            <label htmlFor="fullname"></label>
            <input onChange={handleChange} type="text" name="fullname" placeholder="fullname" />
          </span>
        )}

        <button>{isSignup ?'Signup':'Login'}</button>
      </form>


{/* 
      <button onClick={() => onLogOut()}>Logout</button> */}

      <button onClick={onSignChange}>{isSignup? 'Already member? login':'New user? sign up!'}</button>
    </section>
  )
}
