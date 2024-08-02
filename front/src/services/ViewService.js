import Api from '../boot/axios'

export default {
  getViews () {
    return Api().get('views')
  },
  store (params) {
    return Api().post('views', params)
  }
}
