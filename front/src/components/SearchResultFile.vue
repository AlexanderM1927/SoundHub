<template>
  <div class="q-mb-sm">
    <div class="search-result">
      <svg @click="openPlayer(result)" class="search-result__image" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#5f6368">
        <path d="M640-160q-50 0-85-35t-35-85q0-50 35-85t85-35q11 0 21 1.5t19 6.5v-328h200v80H760v360q0 50-35 85t-85 35ZM120-320v-80h320v80H120Zm0-160v-80h480v80H120Zm0-160v-80h480v80H120Z"/>
      </svg>
      <div class="d-flex space-between w-100">
        <div @click="openPlayer(result)">{{ result.sound_name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import SoundPlaylistService from '../services/SoundPlaylistService'
import { functions } from '../functions.js'

export default {
  mixins: [functions],
  name: 'SearchResultFile',
  props: ['result', 'download', 'tiny', 'playlist'],
  data () {
    return {
    }
  },
  methods: {
    async removeFromPlaylist () {
      try {
        const data = {
          sound_playlist_id: this.result.sound_playlist_id
        }
        const request = await SoundPlaylistService.remove(data)
        if (request.status >= 200 && request.status < 300) {
          this.alert('positive', 'Canción eliminada del playlist correctamente')
          this.$destroy()
          this.$el.parentNode.removeChild(this.$el)
        }
      } catch (error) {
        this.manageErrors(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
