import React, { useContext } from 'react'

import './App.css'
import { useAuth0 } from './contexts/auth0-context'
import Login from './components/Login'
import TopBar from './components/TopBar'
import Group from './components/Group'


function App() {
  const { isLoading, user, logout, loginWithRedirect } = useAuth0()

  return (
    <div className="App">
      <div className="hero is-info is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            {!isLoading && !user && <Login></Login>}
            {!isLoading && user && (
              <>
                <TopBar></TopBar>
                <Group></Group>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

