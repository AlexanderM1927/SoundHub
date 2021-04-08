import Api from '../boot/axios'
// import request from 'request-promise-native'
export default {
  getItemsByName (params) {
    return Api().get('search/' + params.name)
  },
  getSongByUrl (params) {
    return Api().get('download/' + params.url, { responseType: 'blob' })
  }
}
