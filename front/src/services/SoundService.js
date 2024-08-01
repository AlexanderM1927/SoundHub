import Api from '../boot/axios'

export default {
  store (params) {
    return Api().post('sounds', params)
  },
  update (params) {
    return Api().post('sounds/' + params.sound_id, params)
  },
  delete (params) {
    return Api().delete('sounds/' + params.sound_id)
  },
  getMySounds (params) {
    return Api().get('sounds/' + params.user_id)
  },
  getSoundById (params) {
    return Api().get('sounds_id/' + params.type + '/' + params.url)
  }
}
