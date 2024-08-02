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
    const sound = await fetch(url)
    const blob = await sound.blob()
    const newBlob = new Blob([blob], { type: 'audio/mp3' })
    const newUrl = URL.createObjectURL(newBlob)
    if (!payload.playlistMode) {
      commit('setSong', {
        url: newUrl,
        payload: payload
      })
    } else {
      if (payload.isFirstOnPlaylist) {
        commit('setSong', {
          url: newUrl,
          payload: payload
        })
      } else {
        // Download sound in background
        const downloadBackgroundSound = () => {
          setTimeout(async () => {
            const canDownloadNextSong = window.canDownloadNextSong
            if (canDownloadNextSong) {
              window.canDownloadNextSong = false
              const sound = await fetch(url)
              const blob = await sound.blob()
              const newBlob = new Blob([blob], { type: 'audio/mp3' })
              const newUrl = URL.createObjectURL(newBlob)
              commit('setSongOnPlaylist', {
                url: newUrl,
                payload: payload
              })
              window.canDownloadNextSong = true
            } else {
              downloadBackgroundSound()
            }
          }, 1000)
        }
        downloadBackgroundSound()
      }
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
