import React from 'react'
import './Group.scss'
import { inject, observer } from 'mobx-react'
import WssStore from '../stores/wss'

@inject('wss')
@observer
class Group extends React.Component<{wss?: WssStore}, any> {
    render() {
        const { wss } = this.props
        const { userGroups, otherGroups } = wss!.store
        return (
            <ul className="groups">
                <li>My groups
                    <ul>
                        {userGroups.map(g => <li className={g.selected ? 'selected' : ''}>
                            {g.name} {g.selected ? '(active)': ''}
                        </li>)}
                    </ul>
                </li>
                <li>Other groups
                    <ul>
                        {otherGroups.map(g => <li>{g.name}</li>)}
                    </ul>
                </li>
            </ul>
        )
    }
}

export default Group