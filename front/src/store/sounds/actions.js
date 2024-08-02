// import Api from '../../boot/axios'
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

const setPlaylistDefault = (relatedVideos, dispatch) => {
  // const videos = relatedVideos.slice(0, 5)
  for (let i = 0; i < relatedVideos.length; i++) {
    dispatch('getSongById', {
      url: relatedVideos[i].id,
      type: 'video',
      playlistMode: true,
      isFirstOnPlaylist: false,
      img: relatedVideos[i].thumbnail[0].url,
      title: relatedVideos[i].title
    })
  }
}

const getUrl = async (url) => {
  const sound = await fetch(url)
  const relatedVideos = JSON.parse(sound.headers.get('related-videos'))
  const blob = await sound.blob()
  const newBlob = new Blob([blob], { type: 'audio/mp3' })
  const newUrl = URL.createObjectURL(newBlob)

  return {
    newUrl,
    relatedVideos
  }
}

export const getSongById = async ({ commit, dispatch }, payload) => {
  try {
    const url = SearchService.getSongById(payload)
    if (!payload.playlistMode) {
      const { newUrl, relatedVideos } = await getUrl(url)
      commit('setSong', {
        url: newUrl,
        payload: payload
      })
      setPlaylistDefault(relatedVideos, dispatch)
    } else {
      if (payload.isFirstOnPlaylist) {
        const { newUrl } = await getUrl(url)
        commit('setSong', {
          url: newUrl,
          payload: payload
        })
      } else {
        // Download sound in background
        const downloadBackgroundSound = () => {
          setTimeout(async () => {
            const canDownloadNextSong = window.canDownloadNextSong
            console.log('url', url)
            console.log('canDownloadNextSong', canDownloadNextSong)
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
          }, 2000)
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
