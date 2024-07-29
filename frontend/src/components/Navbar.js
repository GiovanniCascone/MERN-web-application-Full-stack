import {Link} from 'react-router-dom'
import {useLogout} from '../hooks/useLogout'
import {useAuthContext} from '../hooks/useAuthContext'
import {useAuthAdminContext} from '../hooksAdmin/useAuthAdminContext'

const Navbar = () => {
    const logout = useLogout()
    const {user} = useAuthContext()
    const {admin} = useAuthAdminContext()

    const handleClick = () => {
        logout()
    }

    return(
        <nav className='navbar bg-dark shadow px-2'>
            <div className='container-fluid text-center'>
                <Link to='/' className="btn btn-outline-primary fs-5">Home</Link>
                
            
                {(user || admin) ? null :
                <span className='text-end'>
                <Link to='/login' className="btn btn-outline-warning fs-5">Login</Link>
                </span>
                }

                {/*USER*/}
                {user
                &&
                <>
                <Link to='/sale' className="navbar-brand text-warning">Fattura</Link>
                <Link to='/bill' className="navbar-brand text-warning">Bolletta</Link>
                <Link to='/store' className="navbar-brand text-warning">Magazzino</Link>
                <div className="dropdown">
                    <button 
                        className="btn btn-secondary dropdown-toggle bg-light text-warning-emphasis" 
                        type="button" id="prova" 
                        data-bs-toggle="dropdown" 
                        aria-expanded="true">
                            Gestione
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="prova">
                        <li><Link to='/bills' className="dropdown-item">Bollette</Link></li>
                        <li><Link to='/sales' className="dropdown-item">Fatture</Link></li>
                        <li><Link to='/producer' className="dropdown-item">Produttore</Link></li>
                    </ul>
                </div>
                <Link to='/trend' className="btn btn-outline-info">Trend</Link>
                <div className='fs-6 fw-normal fst-italic text-warning-emphasis btn btn-outline-info bg-light'>Box: {user.box} {user.nome}</div>
                <button className='btn btn-outline-danger' onClick={handleClick}>Logout</button>
                </>
                }
 
 
                {/*ADMIN*/}
                {admin
                &&
                <>
                <Link to='/box' className="navbar-brand text-primary">Gestione Box</Link>
                <Link to='/product' className="navbar-brand text-primary">Gestione Prodotti</Link>
                <Link to='/buyer' className="navbar-brand text-primary">Gestione Clienti</Link>
                <div className='fs-5 fw-normal fst-italic text-warning-emphasis badge bg-light text-wrap'>Admin: {admin.box} {admin.nome}</div>
                <button className='btn btn-outline-danger' onClick={handleClick}>Logout</button>
                </>
                }

            </div>
        </nav>
    )
}

export default Navbar