/*
export function someMutation (state) {
}
*/

export const setSearchResults = (state, payload) => {
  state.searchResults = payload
}

export const setLoading = (state, payload) => {
  console.log('payload')
  console.log(payload)
  state.loading = payload
}
