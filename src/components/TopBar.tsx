import React from 'react'
import { useUserContext } from '../contexts/user-context'
import './TopBar.scss'

function TopBar() {
    const { user, logout } = useUserContext()
    return (
        <div className="nes-container topbar-container">
            <section className="topbar">
                You are logged in as {user.name}
                <button
                    onClick={() => logout({ returnTo: window.location.origin })}
                    className="nes-btn is-warning"
                >
                    Logout
                </button>
            </section>
        </div>
    )
}

export default TopBar