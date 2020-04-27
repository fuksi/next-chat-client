import React, { Component, createContext, useContext } from 'react'
import createAuth0Client, { Auth0ClientOptions, Auth0Client, IdToken } from '@auth0/auth0-spa-js'
import { inject } from 'mobx-react'
import WssStore from '../stores/wss'

const NOOA_LAB_AUTH0_DOMAIN = 'nooalab.eu.auth0.com'
const NEXT_CHAT_CLIENT_ID = 'H4Ji4P1XuBn32r6FAaWWg0U3DHYdBdCA'
const NEXT_CHAT_SERVICE_AUDIENCE = 'https://api.nextchat.com'

export interface IUserContext {
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
const UserContext = createContext<IUserContext>({} as IUserContext)
export const useUserContext = () => useContext(UserContext)

@inject('wss')
export class UserProvider extends Component<{wss?: WssStore}, any> {
    
    messageCounter = 0

    state = {
        isLoading: true,
        isAuthenticated: false,
    } as IUserContext

    authConfig: Auth0ClientOptions = {
        domain: NOOA_LAB_AUTH0_DOMAIN,
        client_id: NEXT_CHAT_CLIENT_ID,
        redirect_uri: window.location.origin,
        audience: NEXT_CHAT_SERVICE_AUDIENCE
    }

    componentDidMount() {
        this.initializeAuth0()
    }

    async initSignalR() {
        if (this.state.isAuthenticated) {
            const accessToken = await this.state.auth0Client.getTokenSilently()
            this.props.wss!.initSignalR(accessToken)
        }
    }

    async initializeAuth0() {
        const auth0Client = await createAuth0Client(this.authConfig)
        this.setState({ auth0Client })

        if (window.location.search.includes('code=')) {
            return this.handleRedirectCallback()
        }

        const isAuthenticated = await auth0Client.isAuthenticated()
        const user = isAuthenticated ? await auth0Client.getUser() : null
        this.setState({ auth0Client, isAuthenticated, user, isLoading: false }, async () => await this.initSignalR())
    }


    async handleRedirectCallback() {
        this.setState({ isLoading: true })

        await this.state.auth0Client.handleRedirectCallback()
        const user = await this.state.auth0Client.getUser()

        this.setState({ user, isAuthenticated: true, isLoading: false }, async () => await this.initSignalR())
        window.history.replaceState({}, document.title, window.location.pathname)
    }



    render() {
        const { children } = this.props
        const auth0Client = this.state.auth0Client
        const configObject: IUserContext = {
            ...this.state,
            loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
            getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
            getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
            logout: (...p) => auth0Client.logout(...p)
        }

        return (
            <UserContext.Provider value={configObject}>
                {children}
            </UserContext.Provider>
        )
    }
}