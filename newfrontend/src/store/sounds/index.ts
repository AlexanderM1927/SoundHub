import state from './state.ts'
import * as getters from './getters.ts'
import * as mutations from './mutations.ts'
import * as actions from './actions.ts'
import { defineStore } from 'pinia'


export const useSoundStore = defineStore('sound', () => {


  return {
    state,
    getters,
    mutations,
    actions
  }
})