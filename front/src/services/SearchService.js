import Api from '../boot/axios'
// import request from 'request-promise-native'
export default {
  getItemsByName (params) {
    return Api().get('search/' + params.name)
  },
  getSongById (params) {
    return Api().get('download/' + params.type + '/' + params.url, { responseType: 'blob' })
  }
}
