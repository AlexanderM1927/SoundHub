import Api from '../boot/axios'

export default {
  add (params) {
    return Api().post('sound-playlist', params)
  },
  remove (params) {
    return Api().delete('sound-playlist/' + params.sound_playlist_id)
  }
}
