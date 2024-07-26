/*
export function someMutation (state) {
}
*/

export const setSearchResults = (state: any, payload: any) => {
  state.searchResults = payload
}

export const setSearchText = (state: any, payload: any) => {
  state.searchText = payload
}

export const setLoading = (state: any, payload: any) => {
  state.loading = payload
}

export const setSong = (state: any, payload: any) => {
  state.song = payload
}

export const setSongOnPlaylist = (state: any, payload: any) => {
  state.playlist.push(payload)
}

export const setPosOnPlaylist = (state: any, payload: any) => {
  state.position = payload
}

export const reloadPlaylist = (state: any) => {
  state.playlist = []
  state.position = 0
  state.song = null
}
