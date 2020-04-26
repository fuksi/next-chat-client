import * as signalR from '@aspnet/signalr'
import { observable, action } from 'mobx'

const NEXT_CHAT_HUB = 'http://localhost:8471/chatHub'
const NEXT_CHAT_HUB_SEND_PATH = 'SendMessage'
const NEXT_CHAT_HUB_RECEIVED_TARGET = 'ReceivedMessage'

enum UserAction {
    None = 0,
    InitializeConnection,
    CreateGroup,
    JoinGroup,
    LeaveGroup,
    AddMessage
}

class WssStore {

    messageCounter = 0
    connection: signalR.HubConnection | null = null
    wsDataHandler: any[] = []

    @observable store: any = {
        otherGroups: [],
        userGroups: []
    }

    registerWsEventHandler() {
        this.connection!.on(NEXT_CHAT_HUB_RECEIVED_TARGET, data => {
            const handlerWrapper = this.wsDataHandler.find(h => h.counter == data.counter)
            if (handlerWrapper) handlerWrapper.handler(data)
        })
    }

    sendToHub(msg: any, dataHandler) {
        this.connection!.invoke(NEXT_CHAT_HUB_SEND_PATH, msg)
        this.wsDataHandler.push(dataHandler)
    }

    wsRequestInitialState() {
        const counter = this.getCounter()
        var msg = {
            counter,
            action: UserAction.InitializeConnection
        }

        var handlerWrapper = {
            counter,
            handler: data => this.initialStateHandler(data)
        }

        this.sendToHub(msg, handlerWrapper)
    }

    @action
    initialStateHandler(data) {
        this.store = data.initialState
    }


    getCounter() {
        return ++this.messageCounter
    }

    async initSignalR(accessToken) {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(NEXT_CHAT_HUB, {accessTokenFactory: () => accessToken})
            .build()

        this.registerWsEventHandler()

        return this.connection.start().then(() => this.wsRequestInitialState())
    }
}

export default WssStore