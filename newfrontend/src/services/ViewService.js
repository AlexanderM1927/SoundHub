import Api from '../boot/axios'

export default {
  getCommentsBySound () {
    return Api().get('views')
  }
}
