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
            newGroupName: '',
            groupToJoin: null
        }
    }

    newMessageChanged(event) {
        this.setState({ newMessage: event.target.value })
    }

    onSendMessageClicked(groupId: string) {
        if (this.state.newMessage) {
            this.props.wss!.wsSendNewMessage(this.state.newMessage, groupId)
            this.setState({ newMessage: '' })
        }
    }

    onLeaveGroupClicked(groupId: string) {
        this.props.wss!.wsLeaveGroup(groupId)
    }

    onOtherGroupClicked(group) {
        this.setState({ groupToJoin: group })
    }

    onJoinGroupClicked() {
        this.props.wss!.wsJoinGroup(this.state.groupToJoin.id)
        this.setState({ groupToJoin: null })
    }

    onUserGroupClicked(selectedGroup) {
        this.setState({ groupToJoin: null }, () => {

            const userGroups = [...this.props.wss!.userGroups]
            const currentSelected = userGroups.find(g => g.selected)
            if (currentSelected) currentSelected.selected = false

            const newSelected = userGroups.find(g => g.id === selectedGroup.id)
            newSelected.selected = true

            this.props.wss!.userGroups = userGroups
        })
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
                                <li><button onClick={e => this.onUserGroupClicked(g)} className={(g.selected ? "is-primary" : "") + " nes-btn"}>
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
                <button className="nes-btn is-success" onClick={e => this.onOpenNewGroupDialogClicked()}>
                    Create new group
                </button>
                <dialog className="nes-dialog" id="dialog-default">
                    <form method="dialog">
                        <p className="title">A group need a name. Max 100 characters</p>
                        <input type="text" className="nes-input" value={this.state.newGroupName} onChange={e => this.onNewGroupNameChanged(e)}></input>
                        <menu className="dialog-menu">
                            <button className="nes-btn">Cancel</button>
                            {this.state.newGroupName && <button
                                onClick={e => this.onCreateNewGroupClicked()}
                                className="is-primary nes-btn">
                                Create
                            </button>}
                        </menu>
                    </form>
                </dialog>

            </div>
        )
    }

    onCreateNewGroupClicked() {
        this.props.wss!.wsCreateGroup(this.state.newGroupName)
    }

    onNewGroupNameChanged(event) {
        this.setState({ newGroupName: event.target.value })
    }

    onOpenNewGroupDialogClicked() {
        const el = document.getElementById("dialog-default")! as any
        el.showModal()
    }

    renderChatBox() {
        const { userGroups } = this.props.wss!
        const userId = this.props.wss!.user.sub
        const activeGroup = userGroups.find(g => g.selected)

        if (!activeGroup || this.state.groupToJoin) return null

        return (
            <>
                <div id="chatbox" className="nes-container with-title chatbox-container">
                    <p className="title">{activeGroup.name} </p>

                    {activeGroup.messages.map(m => (
                        <section className={"message " + (m.userId === userId ? "align-right" : "")}>
                            <div className={"nes-balloon " + (m.userId === userId ? "from-right" : "from-left")}>
                                <p>{m.content}</p>
                            </div>
                            <p className="nes-bcrikko">{m.createdAt} {m.email ? m.email : m.userId}</p>
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
                    <button className="nes-btn is-error leave-group-btn"
                        onClick={e => this.onLeaveGroupClicked(activeGroup.id)}>
                        Leave group
                    </button>
                </div>
            </>
        )
    }

    renderJoinBox() {
        if (!this.state.groupToJoin) return null

        const { name, isFull } = this.state.groupToJoin

        return (
            <div className="nes-container with-title joinbox-container is-centered">
                <p className="title">{name}</p>
                {!isFull && (
                    <>
                        <p>Group still have space, click below to join group</p>
                        <button onClick={e => this.onJoinGroupClicked()} className="button is-danger">
                            Join group
                        </button>
                    </>
                )}
                {isFull && <p>Group is full, please try other group or create new one</p>}
            </div>
        )
    }

    render() {
        return (
            <div className="row">
                <dialog className="nes-dialog" id="info-dialog">
                    <form method="dialog">
                        <p className="info-dialog-content">A group need a name. Max 100 characters</p>
                        <menu className="dialog-menu">
                            <button className="nes-btn">Close</button>
                        </menu>
                    </form>
                </dialog>
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