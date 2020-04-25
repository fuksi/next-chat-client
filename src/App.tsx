import React from 'react'
import { inject } from 'mobx-react'

import logo from './logo.svg'
import './App.css'
import UserStore from './stores/user'

@inject('user')
class App extends React.Component<{user?: UserStore}> {
  render() {
    const { user } = this.props
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
        </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React {user!.text}
        </a>
        </header>
      </div>
    );
  }
}

export default App

