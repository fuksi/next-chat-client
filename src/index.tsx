import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import { UserProvider } from './contexts/user-context'
import '98.css'

import './index.css'
import App from './App'
import stores from './stores'


ReactDOM.render(
    <React.StrictMode>
        <Provider {...stores}>
            <UserProvider>
                <App />
            </UserProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
)