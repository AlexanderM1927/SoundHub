import Api from '../boot/axios'

export default {
  getItemsByName (params) {
    return Api().get('search/' + params.name)
  }
}
