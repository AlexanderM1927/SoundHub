// import Api from '../../boot/axios'
/*
export function someAction (context) {
}
*/
import SearchService from '../../services/SearchService'

let videosToDownload = []
let parentDownload = ''
let isDownloadingFirstSound = false

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

const setPlaylistDefault = ({ relatedVideos, dispatch, urlParent }) => {
  videosToDownload = [...relatedVideos.map((obj) => {
    return obj.id
  })]
  // const videos = relatedVideos.slice(0, 5)
  for (let i = 0; i < relatedVideos.length; i++) {
    dispatch('getSongById', {
      url: relatedVideos[i].id,
      type: 'video',
      playlistMode: true,
      isFirstOnPlaylist: false,
      img: relatedVideos[i].thumbnail[0].url,
      title: relatedVideos[i].title,
      urlParent
    })
    if (i === (relatedVideos.length - 2)) window.penultimateSoundRelated = relatedVideos[i].id
  }
}

const getRelatedVideos = async (url) => {
  const { data } = await SearchService.getRelatedVideos({ url })
  const relatedVideos = data.data

  return {
    relatedVideos
  }
}

const addSoundsToPlaylist = ({ commit, url, payload }) => {
  let newUrl
  if (payload.type === 'device') {
    newUrl = payload.url
  } else {
    newUrl = url
  }
  if (videosToDownload.length > 0) {
    if (videosToDownload.includes(payload.url)) {
      commit('setSongOnPlaylist', {
        url: newUrl,
        payload: payload
      })
    }
  } else {
    if (payload.urlParent === parentDownload && !isDownloadingFirstSound) {
      commit('setSongOnPlaylist', {
        url: newUrl,
        payload: payload
      })
    } else {
      commit('reloadPlaylist')
    }
  }
}

export const getSongById = async ({ commit, dispatch }, payload) => {
  try {
    const url = SearchService.getSongById(payload)
    if (!payload.playlistMode || payload.isFirstOnPlaylist) {
      isDownloadingFirstSound = true
      if (window.timeoutdownloadBgId) clearTimeout(window.timeoutdownloadBgId)
      commit('reloadPlaylist')
      videosToDownload = []
      let newUrl, relatedVideos
      if (payload.type === 'device') {
        newUrl = payload.url
        relatedVideos = []
      } else {
        newUrl = url
      }
      commit('setSong', {
        url: newUrl,
        payload: payload
      })
      commit('setSongOnPlaylist', {
        url: newUrl,
        payload: payload
      })
      if (!payload.playlistMode && payload.type === 'video') {
        const data = await getRelatedVideos(payload.url)
        relatedVideos = data.relatedVideos
        setPlaylistDefault({ relatedVideos, dispatch, urlParent: payload.url })
      }
      parentDownload = payload.url
      isDownloadingFirstSound = false
    } else if (payload.playlistMode) {
      if (payload.requireRelatedSounds) { // this is used by the last sound on playlist to following with suggestions
        const { relatedVideos } = await getRelatedVideos(payload.url)
        setPlaylistDefault({ relatedVideos, dispatch, urlParent: payload.url })
      }
      // Download sound in background
      // isplaylist
      addSoundsToPlaylist({ commit, url, payload })
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
