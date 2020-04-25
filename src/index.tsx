import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import { Auth0Provider } from './contexts/auth0-context'
import '98.css'

import './index.css'
import App from './App'
import stores from './stores'


ReactDOM.render(
    <React.StrictMode>
        <Auth0Provider>
            <Provider {...stores}><App /></Provider>
        </Auth0Provider>
    </React.StrictMode>,
    document.getElementById('root')
)