import React from 'react'

import './App.css'
import { useUserContext } from './contexts/user-context'
import Login from './components/Login'
import TopBar from './components/TopBar'
import ChatComponent from './components/ChatComponent'


function App() {
  const { isLoading, user } = useUserContext()

  return (
    <div className="App">
      {!isLoading && !user && <Login></Login>}
      {!isLoading && user && (
        <>
          <TopBar></TopBar>
          <ChatComponent></ChatComponent>
        </>
      )}
    </div>
  )
}

export default App

