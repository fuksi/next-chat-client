import React from 'react'
import { useUserContext } from '../contexts/user-context'
import './TopBar.scss'

function TopBar() {
    const { user, logout } = useUserContext()
    return (
        <div className="topbar">
            <pre>
                <code>You are logged in as {user.name}</code>
                <button
                    onClick={() => logout({ returnTo: window.location.origin })}
                    className="button is-small is-dark"
                >
                    Logout
                </button>
            </pre>
        </div>
    )
}

export default TopBar