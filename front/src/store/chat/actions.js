/*
export function someAction (context) {
}
*/

export const addChats = ({ commit }, payload) => {
  try {
    commit('addChats', payload)
  } catch (error) {
    console.log(error)
  }
}

export const addNotification = ({ commit }, payload) => {
  try {
    commit('addNotification', payload)
  } catch (error) {
    console.log(error)
  }
}

export const removeNotification = ({ commit }, payload) => {
  try {
    commit('removeNotification', payload)
  } catch (error) {
    console.log(error)
  }
}
