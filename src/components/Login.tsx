import React from 'react'
import { useAuth0 } from '../contexts/auth0-context'
import './Login.scss'

function Login() {
    const { loginWithRedirect } = useAuth0()
    return (
        <div className="login">
            <pre style={{ maxWidth: "375px" }}>
                <code>
                    Welcome to Next Chat service!<br></br>
                    Please login/signup to continue<br></br>
                    (it's real quick)
                </code>
            </pre>
            <div>
                <button onClick={loginWithRedirect} className="button is-danger">
                    Login
                </button>
            </div>
        </div>
    )
}

export default Login