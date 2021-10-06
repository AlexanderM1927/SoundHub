import Api from '../boot/axios'

export default {
  add (params) {
    return Api().post('sound-playlist', params, { headers: { Authorization: params.token } })
  },
  remove (params) {
    return Api().delete('sound-playlist/' + params.sound_playlist_id, { headers: { Authorization: params.token } })
  }
}
