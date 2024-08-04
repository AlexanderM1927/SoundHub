// import Api from '../../boot/axios'
/*
export function someAction (context) {
}
*/
import SearchService from '../../services/SearchService'

let localDownloadId = null

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

const downloadBackgroundSound = ({ commit, url, payload }) => {
  window.downloadBackgroundSoundId = setTimeout(async () => {
    const canDownloadNextSong = window.canDownloadNextSong
    if (canDownloadNextSong === true) {
      if (localDownloadId && (localDownloadId === window.downloadBgId)) {
        window.canDownloadNextSong = false
        const { newUrl } = await getUrl(url)
        commit('setSongOnPlaylist', {
          url: newUrl,
          payload: payload
        })
        window.canDownloadNextSong = true
      } else {
        reloadPlaylist({ commit })
        clearTimeout(window.downloadBackgroundSoundId)
      }
    } else {
      downloadBackgroundSound({ commit, url, payload })
    }
  }, 2000)
}

export const getSongById = async ({ commit, dispatch }, payload) => {
  try {
    const url = SearchService.getSongById(payload)
    if (payload.localDownloadId && !localDownloadId) {
      console.log('cambio la id')
      localDownloadId = payload.localDownloadId
    }
    if (!payload.playlistMode || payload.isFirstOnPlaylist) {
      const { newUrl, relatedVideos } = await getUrl(url)
      commit('setSong', {
        url: newUrl,
        payload: payload
      })
      commit('setSongOnPlaylist', {
        url: newUrl,
        payload: payload
      })
      if (!payload.playlistMode && payload.type === 'video') {
        setPlaylistDefault(relatedVideos, dispatch)
      }
    } else if (payload.playlistMode) {
      // Download sound in background
      // isplaylist
      downloadBackgroundSound({ commit, url, payload })
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
