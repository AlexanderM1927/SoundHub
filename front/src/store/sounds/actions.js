// import Api from '../../boot/axios'
/*
export function someAction (context) {
}
*/
import SearchService from '../../services/SearchService'

let canDownloadNextSong = false
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

const getBlobUrl = async (url) => {
  const request = await fetch(url)
  const blob = await request.blob()
  const newBlob = new Blob([blob], { type: 'audio/mp3' })
  const newUrl = URL.createObjectURL(newBlob)

  return newUrl
}

const downloadBackgroundSound = async ({ commit, url, payload }) => {
  if (canDownloadNextSong) {
    let newUrl
    canDownloadNextSong = false
    if (payload.type === 'device') {
      newUrl = payload.url
    } else {
      newUrl = await getBlobUrl(url)
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
    canDownloadNextSong = true
  } else {
    window.timeoutdownloadBgId = setTimeout(async () => {
      await downloadBackgroundSound({ commit, url, payload })
    }, 2000)
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
        const data = await getRelatedVideos(payload.url)
        newUrl = url
        relatedVideos = data.relatedVideos
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
        setPlaylistDefault({ relatedVideos, dispatch, urlParent: payload.url })
      }
      parentDownload = payload.url
      canDownloadNextSong = true
      isDownloadingFirstSound = false
    } else if (payload.playlistMode) {
      if (payload.requireRelatedSounds) { // this is used by the last sound on playlist to following with suggestions
        const { relatedVideos } = await getRelatedVideos(payload.url)
        setPlaylistDefault({ relatedVideos, dispatch, urlParent: payload.url })
      }
      // Download sound in background
      // isplaylist
      await downloadBackgroundSound({ commit, url, payload })
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
