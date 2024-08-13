import Api from '../boot/axios'
// import request from 'request-promise-native'
export default {
  getItemsByName (params) {
    return Api().get('search/' + params.name)
  },
  getSongById (params) {
    return process.env.API_URL + 'download/' + params.type + '/' + params.url
  },
  download (params) {
    return Api().get('download/' + params.type + '/' + params.url, { responseType: 'blob' })
  },
  getRelatedVideos (params) {
    return Api().get('related_videos/' + params.url)
  }
}
