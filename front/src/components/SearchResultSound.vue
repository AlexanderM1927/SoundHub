<template>
  <div class="q-mb-sm">
    <div v-if="playlist" class="search-result">
      <img
        v-if="getSoundImage(result)"
        @click="openPlayer(result)"
        :src="getSoundImage(result)"
        class="search-result__image"
      >
      <div class="d-flex space-between w-100">
        <div @click="openPlayer(result)">{{ getSoundTitle(result) }}</div>
        <div v-if="playlist === true">
          <a class="pli-delete text-white" @click="removeFromPlaylist"> <q-icon name="fas fa-times"/></a>
        </div>
      </div>
    </div>
    <div v-else class="search-result" @click="openPlayer(result)">
      <img
        v-if="getSoundImage(result)"
        :src="getSoundImage(result)"
        class="search-result__image"
      >
      <div class="d-flex space-between w-100">
        <div>{{ getSoundTitle(result) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import SoundPlaylistService from '../services/SoundPlaylistService'
import { functions } from '../functions.js'

export default {
  mixins: [functions],
  name: 'SearchResultSound',
  props: ['result', 'download', 'tiny', 'playlist'],
  data () {
    return {
    }
  },
  methods: {
    getSoundImage (result) {
      if (!result) return ''

      if (result.sound_thumbnail_url) {
        return this.getSrcFromBackend(result.sound_thumbnail_url)
      }

      if (result.img) {
        return this.getSrcFromBackend(result.img)
      }

      return ''
    },
    getSoundTitle (result) {
      if (!result) return 'Sin título'

      return result.title || result.sound_name || 'Sin título'
    },
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
