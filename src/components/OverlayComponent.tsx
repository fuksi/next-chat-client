import React from 'react'
import LoadingOverlay from 'react-loading-overlay'
import { inject, observer } from 'mobx-react'

import WssStore from '../stores/wss'
import './OverlayComponent.scss'

@inject('wss')
@observer
class OverlayComponent extends React.Component<{wss?:WssStore}> {

    render() {
        return (
            <LoadingOverlay
                active={this.props.wss?.processing}
                spinner
                text='Processing'>
                {this.props.children}
            </LoadingOverlay>
        )
    }
}

export default OverlayComponent