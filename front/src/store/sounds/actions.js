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

export const getSongById = async ({ commit }, payload) => {
  try {
    const url = SearchService.getSongById(payload)
    if (payload.isFirstOnPlaylist) {
      commit('setSongOnPlaylist', {
        url: url,
        payload: payload
      })
    }
    if (!payload.playlistMode) {
      commit('setSong', {
        url: url,
        payload: payload
      })
    } else {
      // Download sound in background
      const sound = await fetch(SearchService.getSongById(payload))
      const blob = await sound.blob()
      const newBlob = new Blob([blob])
      const newUrl = URL.createObjectURL(newBlob)
      commit('setSongOnPlaylist', {
        url: newUrl,
        payload: payload
      })
    }
    return url
  } catch (error) {
    console.log(error)
  }
}

export const setPosition = ({ commit }, payload) => {
  try {
    commit('setPosOnPlaylist', payload)
  } catch (error) {
    console.log(error)
  }
}

export const reloadPlaylist = ({ commit }) => {
  try {
    commit('reloadPlaylist')
  } catch (error) {
    console.log(error)
  }
}
