/*
export function someMutation (state) {
}
*/

export const addChats = (state, payload) => {
  state.chats.push(payload)
}

export const addNotification = (state, payload) => {
  state.notifications.push(payload)
}

export const removeNotification = (state, payload) => {
  const index = state.notifications.indexOf(payload)
  state.notifications.splice(index)
}
