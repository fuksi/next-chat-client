import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import { UserProvider } from './contexts/user-context'

import './index.css'
import App from './App'
import stores from './stores'
import OverlayComponent from './components/OverlayComponent'


ReactDOM.render(
    <React.StrictMode>
        <Provider {...stores}>
            <OverlayComponent>
                <UserProvider>
                    <App />
                </UserProvider>
            </OverlayComponent>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
)