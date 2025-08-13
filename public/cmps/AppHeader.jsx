import { authService } from '../services/auth.service.frontend.js'
import { showErrorMsg } from '../services/event-bus.service.js'


const { NavLink, useNavigate } = ReactRouterDOM

export function AppHeader({ loggedinUser,setLoggedinUser }) {
  const navigate = useNavigate()

  function onLogOut() {
    authService.logout()
    .then(() => {
      setLoggedinUser(null)
      navigate('/auth')
    })
    .catch(err=> {
        console.log(err)
        showErrorMsg('Couldnt logout')
    })
  }

  return (
    <header className="app-header main-content single-row">
      <h1>Miss Bug</h1>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/bug">Bugs</NavLink>
        <NavLink to="/about">About</NavLink>
        {loggedinUser ? (
          <span>
            <span>{loggedinUser ? loggedinUser.username : ''}</span>
            <button onClick={onLogOut}>Logout</button>
          </span>
        ):
        <span> <NavLink to="/auth">login</NavLink></span>}
      </nav>
    </header>
  )
}
