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

export const getSongById = ({ commit }, payload) => {
  try {
    const url = SearchService.getSongById(payload)
    // const binary = convertDataURIToBinary(response)
    // const blob = new Blob([response], { type: 'audio/mp3' })
    // const url = URL.createObjectURL(response.data)
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
      commit('setSongOnPlaylist', {
        url: url,
        payload: payload
      })
    }
    return url
  } catch (error) {
    console.log(error)
  }
}

export const getSongByUrl = ({ commit }, payload) => {
  try {
    if (payload.isFirstOnPlaylist) {
      commit('setSongOnPlaylist', {
        url: payload.url,
        payload: payload
      })
    }
    if (!payload.playlistMode) {
      commit('setSong', {
        url: payload.url,
        payload: payload
      })
    } else {
      commit('setSongOnPlaylist', {
        url: payload.url,
        payload: payload
      })
    }
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
