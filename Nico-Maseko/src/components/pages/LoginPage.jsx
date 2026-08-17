function LoginPage({ username, password, setUsername, setPassword, loginError, handleLogin }) {
  return (
    <div className="panel auth-panel">
      <h2>Admin login</h2>
      <form onSubmit={handleLogin} className="form-grid">
        <label>
          Username
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button type="submit">Login</button>
        {loginError && <p className="error-text">{loginError}</p>}
      </form>
    </div>
  )
}

export default LoginPage
