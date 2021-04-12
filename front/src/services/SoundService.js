import Api from '../boot/axios'

export default {
  store (params, token) {
    return Api().post('sounds', params, { headers: { Authorization: token } })
  },
  update (params, token) {
    return Api().post('sounds/' + params.sound_id, params, { headers: { Authorization: token } })
  },
  delete (params) {
    return Api().delete('sounds/' + params.sound_id, { headers: { Authorization: params.token } })
  },
  getMySounds (params) {
    return Api().get('sounds/' + params.user_id, { headers: { Authorization: params.token } })
  }
}
