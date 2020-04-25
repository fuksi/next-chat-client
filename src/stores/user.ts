import { observable } from 'mobx'
import * as auth0 from 'auth0-js'
import jwt from 'jwt-decode'
import moment from 'moment'

const ID_TOKEN_KEY = 'id_token'

class UserStore {
    @observable text: string = 'foo'
}

export default UserStore