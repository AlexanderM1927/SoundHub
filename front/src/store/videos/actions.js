/*
export function someAction (context) {
}
*/
import SearchService from '../../services/SearchService'

export const getItemsByName = async ({ commit }, payload) => {
  try {
    const response = await SearchService.getItemsByName(payload)
    commit('setSearchResults', response.data)
    return response
  } catch (error) {
    console.log(error)
  }
}
