/*
export function someAction (context) {
}
*/
import SearchService from '../../services/SearchService'

export const getItemsByName = async ({ commit }, payload) => {
  try {
    commit('setLoading', true)
    const response = await SearchService.getItemsByName(payload)
    commit('setSearchResults', response.data.data.items)
    commit('setSearchText', payload.name)
    commit('setLoading', false)
    return response
  } catch (error) {
    console.log(error)
    commit('setLoading', false)
  }
}

export const getSongByUrl = async ({ commit }, payload) => {
  try {
    const response = await SearchService.getSongByUrl(payload)
    // const binary = convertDataURIToBinary(response)
    // const blob = new Blob([response], { type: 'audio/mp3' })
    const url = URL.createObjectURL(response.data)
    commit('setSong', url)
    return response
  } catch (error) {
    console.log(error)
  }
}
