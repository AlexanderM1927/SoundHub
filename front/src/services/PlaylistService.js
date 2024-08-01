import Api from '../boot/axios'

export default {
  store (params) {
    return Api().post('playlists', params)
  },
  get (params) {
    return Api().get('playlists/' + params.playlist_id)
  },
  update (params) {
    return Api().post('playlists/' + params.sound_id, params)
  },
  delete (params) {
    return Api().delete('playlists/' + params.sound_id)
  },
  getPlaylists (params) {
    return Api().get('playlists-user/' + params.user_id)
  }
}
