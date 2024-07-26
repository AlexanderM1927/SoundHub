import Api from '../boot/axios'

export default {
  store (params, token) {
    return Api().post('comments', params, { headers: { Authorization: token } })
  },
  getCommentsBySound (params, token) {
    return Api().get('comments/' + params.id, { headers: { Authorization: token } })
  }
}
