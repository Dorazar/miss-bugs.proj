const { Link } = ReactRouterDOM
const { useState, useEffect } = React
import { BugPreview } from './BugPreview.jsx'
import { getCookie } from '../services/util.service.js'

export function BugList({ bugs, onRemoveBug, onEditBug }) {

    const [cookie,setCookie] = useState(getCookie('visitedBugs'))    


  
  const decode = decodeURIComponent(cookie)
  const visitedBugs = JSON.parse(decode) || []
 

  useEffect(()=> {
  setCookie(cookie)
  },[visitedBugs])
  




    if (!bugs) return <div>Loading...</div>
    return <ul className="bug-list">
        {bugs.map(bug => (
            <li key={bug._id}>
                <BugPreview bug={bug} />
                <section className="actions">
                    <button><Link to={`/bug/${visitedBugs.length <3 || visitedBugs.includes(bug._id) ? bug._id:''}`}>Details</Link></button>
                    <button onClick={() => onEditBug(bug)}>Edit</button>
                    <button onClick={() => onRemoveBug(bug._id)}>x</button>
                </section>
            </li>
        ))}
    </ul >
}
