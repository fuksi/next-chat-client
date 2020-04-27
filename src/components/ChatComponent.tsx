import React from 'react'
import './ChatComponent.scss'
import { inject, observer } from 'mobx-react'
import WssStore from '../stores/wss'

@inject('wss')
@observer
class ChatComponent extends React.Component<{ wss?: WssStore }, any> {

    constructor(props) {
        super(props)
        this.state = {
            activeGroupIdx: 0
        }
    }

    renderGroups() {
        const { userGroups, otherGroups } = this.props.wss!
        return (
            <div className="nes-container with-title groups-container">
                <p className="title">Chat Groups</p>
                <ul className="groups">
                    <li>My groups
                    <ul>
                            {userGroups.map(g => (
                                <li>
                                    <button className={(g.selected ? "is-primary" : "") + " nes-btn"}>
                                        {g.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </li>
                    <li>Other groups
                    <ul>
                            {otherGroups.map(g =>
                                <li>
                                    <button className="nes-btn">
                                        {g.name}
                                    </button>
                                </li>)}
                        </ul>
                    </li>
                </ul>
            </div>
        )
    }

    renderChatBox() {
        const { userGroups } = this.props.wss!
        const activeGroup = userGroups.find(g => g.selected)

        if (!activeGroup) return null

        return (
            <div className="nes-container with-title chatbox-container">
                <p className="title">{activeGroup.name} </p>

                {activeGroup.messages.map(m => (
                    <section className="message">
                        <div className="nes-balloon from-left">
                            <p>{m.content}</p>
                        </div>
                        <p className="nes-bcrikko">{m.createdAt} {m.userId}</p>
                    </section>
                ))}
            </div>
        )
    }

    render() {
        return (
            <div className="row">
                <div className="col-xs-12 col-md-4">
                    {this.renderGroups()}
                </div>
                <div className="col-xs-12 col-md-8">
                    {this.renderChatBox()}
                </div>
            </div>
        )
    }
}

export default ChatComponent