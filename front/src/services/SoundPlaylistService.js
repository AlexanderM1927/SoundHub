import Api from '../boot/axios'

export default {
  add (params) {
    return Api().post('sound-playlist', params, { headers: { Authorization: params.token } })
  }
}
