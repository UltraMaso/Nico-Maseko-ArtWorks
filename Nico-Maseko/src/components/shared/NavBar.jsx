import { useLocation, Link } from 'react-router-dom'

function NavBar({ isAdmin, token, logout }) {
  const location = useLocation()

  return (
    <nav className="nav-bar">
      <Link
        className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
        to="/"
      >
        Gallery
      </Link>
      <Link
        className={location.pathname === '/admin' ? 'nav-link active' : 'nav-link'}
        to="/admin"
      >
        Admin
      </Link>
      {!token ? (
        <Link
          className={location.pathname === '/login' ? 'nav-link active' : 'nav-link'}
          to="/login"
        >
          Login
        </Link>
      ) : (
        <button className="nav-link button-link" onClick={logout}>
          Logout
        </button>
      )}
      {isAdmin && <span className="role-badge">Admin</span>}
    </nav>
  )
}

export default NavBar
