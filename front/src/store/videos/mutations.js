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
