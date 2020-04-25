import { observable } from 'mobx'

class UserStore {
    @observable text: string = 'foo'
}

export default UserStore