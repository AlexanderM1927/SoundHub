<template>
  <div>
    <div class="search-result">
      <img @click="openPlayer(result)" v-if="result.img" :src="result.img" class="search-result__image">
      <img @click="openPlayer(result)" v-else :src="result.thumbnail.thumbnails[0].url" class="search-result__image">
      <div class="d-flex space-between w-100">
        <div @click="openPlayer(result)">{{ result.title }}</div>
        <div v-if="playlist === true">
          <a class="pli-delete text-white" @click="removeFromPlaylist"> <q-icon name="fas fa-times"/></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SoundPlaylistService from '../services/SoundPlaylistService'
import { functions } from '../functions.js'

export default {
  mixins: [functions],
  name: 'SearchResult',
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

<style>
</style>
