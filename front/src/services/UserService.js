import Api from '../boot/axios'

export default {
  login (params) {
    return Api().post('login', params)
  },
  recovery (params) {
    return Api().post('recovery', params)
  },
  changePassword (params) {
    return Api().post('changepassword', params)
  },
  register (params) {
    return Api().post('register', params)
  },
  getUser (params) {
    return Api().get('user/' + params.id)
  },
  modifyUser (params) {
    return Api().put('user/' + params.id, params)
  },
  deleteUser (params) {
    return Api().delete('user/' + params.id)
  },
  logout () {
    return Api().post('logout')
  }
}
