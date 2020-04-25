import React from 'react'
import { inject } from 'mobx-react'
import UserStore from './stores/user'

@inject('user')
class RootComponent extends React.Component<{user?: UserStore}> {
    render() {
    return <div>vowww {this.props.user!.text}</div>
    }
}

export default RootComponent