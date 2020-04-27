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
            newMessage: '',
            groupToJoin: null
        }
    }

    newMessageChanged(event) {
        this.setState({ newMessage: event.target.value })
    }

    onSendMessageClicked(groupId: string) {
        if (this.state.newMessage) {
            this.props.wss!.wsSendNewMessage(this.state.newMessage, groupId)
            this.setState({newMessage: ''})
        }
    }
    
    onLeaveGroupClicked(groupId: string) {
        this.props.wss!.wsLeaveGroup(groupId)
    }

    onOtherGroupClicked(group) {
        this.setState({groupToJoin: group})
    }

    onJoinGroupClicked() {
        this.props.wss!.wsJoinGroup(this.state.groupToJoin.id)
        this.setState({groupToJoin: null})
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
                                <li><button className={(g.selected ? "is-primary" : "") + " nes-btn"}>
                                    {g.name}
                                </button></li>
                            ))}
                        </ul>
                    </li>
                    <li>Other groups
                    <ul>
                            {otherGroups.map(g =>
                                <li><button onClick={e => this.onOtherGroupClicked(g)} className="nes-btn">{g.name}</button></li>)}
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
            <>
                <div id="chatbox" className="nes-container with-title chatbox-container">
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

                <div className="nes-container with-title new-message-container">
                    <p className="title">New message</p>
                    <textarea id="textarea_field" className="nes-textarea"
                        value={this.state.newMessage} onChange={this.newMessageChanged.bind(this)} />
                    <button className={(this.state.newMessage ? "is-success" : "is-disabled") + " nes-btn"}
                            onClick={e => this.onSendMessageClicked(activeGroup.id)}>
                        Send
                    </button>
                    <button className="nes-btn is-error"
                            onClick={e => this.onLeaveGroupClicked(activeGroup.id)}>
                        Leave group
                    </button>
                </div>
            </>
        )
    }

    renderJoinBox() {
        if (!this.state.groupToJoin) return null

        return (
            <div className="nes-container with-title joinbox-container is-centered">
                <p className="title">{this.state.groupToJoin.name} </p>
                <p>
                    Group still have space, click below to join group
                </p>
                <button onClick={e => this.onJoinGroupClicked()} className="button is-danger">
                    Login
                </button>
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
                    {this.renderJoinBox()}
                </div>
            </div>
        )
    }
}

export default ChatComponent