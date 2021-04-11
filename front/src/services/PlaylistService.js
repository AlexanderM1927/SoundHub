import Api from '../boot/axios'

export default {
  store (params) {
    return Api().post('playlists', params, { headers: { Authorization: params.token } })
  },
  get (params) {
    return Api().get('playlists/' + params.playlist_id, { headers: { Authorization: params.token } })
  },
  update (params) {
    return Api().post('playlists/' + params.sound_id, params, { headers: { Authorization: params.token } })
  },
  delete (params) {
    return Api().delete('playlists/' + params.sound_id, { headers: { Authorization: params.token } })
  },
  getMyPlaylists (params) {
    return Api().get('playlists-user/' + params.user_id, { headers: { Authorization: params.token } })
  }
}
