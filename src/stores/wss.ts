import * as signalR from '@aspnet/signalr'
import { observable, action } from 'mobx'
import jwt_decode from 'jwt-decode'

class WssStore {

    messageCounter = 0
    connection: signalR.HubConnection | null = null
    wsDataHandler: any[] = []

    @observable userGroups: any = []
    @observable otherGroups: any = []
    @observable user: any = {}
    @observable processing: boolean = false

    @action
    async initSignalR(accessToken: string) {
        this.user = jwt_decode(accessToken)
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(process.env.REACT_APP_NEXT_CHAT_HUB!, { accessTokenFactory: () => accessToken })
            .build()

        this.registerWsEventHandler()

        return this.connection.start()
            .then(() => this.wsRequestInitialState())
            .catch(console.error)
    }

    registerWsEventHandler() {
        this.connection!.on('InitialState', res => this.initialStateHandler(res))
        this.connection!.on('JoinResult', res => this.joinGroupResultHandler(res))
        this.connection!.on('NewGroupResult', res => this.newGroupResultHandler(res))
        this.connection!.on('LeaveSuccess', res => this.leaveSuccessHandler(res))

        this.connection!.on('NewMessage', res => this.newMessageHandler(res))
        this.connection!.on('NewGroup', res => this.newGroupHandler(res))
        this.connection!.on('NewMember', res => this.groupMemberChangeHandler(res))
        this.connection!.on('MemberLeft', res => this.groupMemberChangeHandler(res))
    }

    @action
    newMessageHandler(res) {
        const newGroups = [...this.userGroups]
        const groupWithNewMessage = newGroups.find(g => g.id === res.groupId)
        if (groupWithNewMessage) {
            groupWithNewMessage.messages = res.messages
        }

        this.userGroups = newGroups

        // Scroll to bottom if it's the current active chatbox
        if (groupWithNewMessage.selected) {
            this.scrollToBottomChatbox()
        }
    }

    @action
    initialStateHandler(res) {
        this.processing = false
        this.userGroups = res.userGroups
        this.otherGroups = res.otherGroups
        if (this.userGroups.length > 0) {
            this.userGroups[0].selected = true
        }

        this.scrollToBottomChatbox()
    }


    @action
    joinGroupResultHandler(res) {
        this.userGroups.forEach(g => g.selected = false)

        res.group.selected = true
        this.userGroups = [...this.userGroups, res.group]
        this.otherGroups = this.otherGroups.filter(g => g.id !== res.group.id)

        this.scrollToBottomChatbox()
    }

    @action
    newGroupResultHandler(res) {
        this.processing = false
        if (!res.success) {
            this.notify(res.errorMessage)
        } else {
            const currentUserGroups = [...this.userGroups]
            currentUserGroups.forEach(g => g.selected = false)

            const newGroup = res.group
            newGroup.selected = true

            this.userGroups = [...currentUserGroups, newGroup]

            this.notify('Group created!')
        }
    }

    @action
    groupMemberChangeHandler(res) {
        const affectedGroup = res.group
        const allGroups = [...this.userGroups, ...this.otherGroups]
        let match = allGroups.find(g => g.id === affectedGroup.id)
        if (match) match.isFull =  affectedGroup.isFull

        this.userGroups = [...this.userGroups]
        this.otherGroups = [...this.otherGroups]
    }

    @action
    newGroupHandler(res) {
        const newGroup = res.group
        const newGroupExistsInUserGroups = !!this.userGroups.find(g => g.id === newGroup.id)
        if (!newGroupExistsInUserGroups) {
            this.otherGroups = [...this.otherGroups, newGroup]
        }
    }

    @action
    leaveSuccessHandler(groupId: string) {
        const groupToMove = this.userGroups.find(g => g.id === groupId)

        this.otherGroups = [...this.otherGroups, groupToMove]
        this.userGroups = this.userGroups.filter(g => g.id !== groupToMove.id)
    }

    scrollToBottomChatbox() {
        // Skip one event loop for mobx to propage state
        setTimeout(() => {
            const chatBoxEl = document.getElementById('chatbox')!
            if (chatBoxEl) chatBoxEl.scrollTop = chatBoxEl.scrollHeight
        })
    }

    sendToHub(path: string, msg: any = {}) {
        this.connection!.invoke(path, msg).catch(console.error)
    }

    wsSendNewMessage(newMessage: string, groupId: string) {
        const msg = { groupId, newMessage }
        this.sendToHub('NewMessage', msg)
    }

    @action
    wsCreateGroup(name: string) {
        this.processing = true
        const msg = { newGroupName: name }
        this.sendToHub('NewGroup', msg)
    }

    wsJoinGroup(groupId: string) {
        const msg = { groupId }
        this.sendToHub('JoinGroup', msg)
    }

    wsLeaveGroup(groupId: string) {
        const msg = { groupId }
        this.sendToHub('LeaveGroup', msg)
    }

    @action
    wsRequestInitialState() {
        this.processing = true
        this.sendToHub('InitializeState')
    }

    notify(content: string) {
        const el = document.getElementById("info-dialog")! as any
        if (el) {
            el.getElementsByClassName('info-dialog-content')[0].innerText = content
            el.showModal()
        }
    }
}

export default WssStore