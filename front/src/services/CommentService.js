import Api from '../boot/axios'

export default {
  store (params) {
    return Api().post('comments', params)
  },
  getCommentsBySound (params) {
    return Api().get('comments/' + params.id)
  }
}
