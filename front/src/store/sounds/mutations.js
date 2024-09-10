/*
export function someMutation (state) {
}
*/

export const setSearchResults = (state, payload) => {
  state.searchResults = payload
}

export const setSearchText = (state, payload) => {
  state.searchText = payload
}

export const setLoading = (state, payload) => {
  state.loading = payload
}

export const setSong = (state, payload) => {
  state.song = payload
}

export const setSongOnPlaylist = (state, payload) => {
  state.playlist.push(payload)
}

export const setPosOnPlaylist = (state, payload) => {
  state.position = payload
}

export const reloadPlaylist = (state) => {
  state.playlist = []
  state.position = 0
  state.song = null
}
