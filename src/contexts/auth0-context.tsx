import React, { Component, createContext, useContext } from 'react'
import createAuth0Client, { Auth0ClientOptions, Auth0Client, IdToken } from '@auth0/auth0-spa-js'

const NOOA_LAB_AUTH0_DOMAIN = 'nooalab.eu.auth0.com'
const NEXT_CHAT_CLIENT_ID = 'H4Ji4P1XuBn32r6FAaWWg0U3DHYdBdCA'

export interface IAuth0Context {
    message: string,
    auth0Client: Auth0Client,
    isLoading: boolean,
    isAuthenticated: boolean,
    user: any,
    loginWithRedirect: (...p: any[]) => Promise<void>,
    getTokenSilently: (...p: any[]) => Promise<any>,
    getIdTokenClaims: (...p: any[]) => Promise<IdToken>,
    logout: (...p: any[]) => void,
}


// Create and export context
const Auth0Context = createContext<IAuth0Context>({} as IAuth0Context)
export const useAuth0 = () => useContext(Auth0Context)

// Create a provider
export class Auth0Provider extends Component {
    state = {
        isLoading: true,
        isAuthenticated: false,
    } as IAuth0Context

    authConfig: Auth0ClientOptions = {
        domain: NOOA_LAB_AUTH0_DOMAIN,
        client_id: NEXT_CHAT_CLIENT_ID,
        redirect_uri: window.location.origin
    }

    componentDidMount() {
        this.initializeAuth0()
    }

    async initializeAuth0() {
        const auth0Client = await createAuth0Client(this.authConfig)
        this.setState({ auth0Client })

        if (window.location.search.includes('code=')) {
            return this.handleRedirectCallback()
        }

        const isAuthenticated = await auth0Client.isAuthenticated()
        const user = isAuthenticated ? await auth0Client.getUser() : null
        this.setState({ auth0Client, isAuthenticated, user, isLoading: false })
    }

    async handleRedirectCallback() {
        this.setState({ isLoading: true })

        await this.state.auth0Client.handleRedirectCallback()
        const user = await this.state.auth0Client.getUser()

        this.setState({ user, isAuthenticated: true, isLoading: false })
        window.history.replaceState({}, document.title, window.location.pathname)
    }



    render() {
        const { children } = this.props
        const auth0Client = this.state.auth0Client
        const configObject: IAuth0Context = {
            ...this.state,
            loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
            getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
            getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
            logout: (...p) => auth0Client.logout(...p)
        }

        return (
            <Auth0Context.Provider value={configObject}>
                {children}
            </Auth0Context.Provider>
        )
    }
}