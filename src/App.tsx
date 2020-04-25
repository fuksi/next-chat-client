import React, { useContext } from 'react'

import './App.css'
import { useAuth0 } from './contexts/auth0-context'
import Login from './components/Login'


function App() {
  const { isLoading, user, logout, loginWithRedirect } = useAuth0()

  return (
    <div className="App">
      <div className="hero is-info is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            {!isLoading && !user && <Login/>}
            {!isLoading && user && (
              <>
                <h1>You are logged in!</h1>
                <p>Hello {user.name}</p>

                {user.picture && <img src={user.picture} alt="My Avatar" />}
                <hr />

                <button
                  onClick={() => logout({ returnTo: window.location.origin })}
                  className="button is-small is-dark"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

