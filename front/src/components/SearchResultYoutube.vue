<template>
  <div>
    <div v-if="playlist" class="search-result">
      <img
        v-if="getYoutubeImage(result)"
        @click="openPlayer(result)"
        :src="getYoutubeImage(result)"
        class="search-result__image"
      >
      <div class="d-flex space-between w-100">
        <div @click="openPlayer(result)">{{ getYoutubeTitle(result) }}</div>
        <div v-if="result.length" class="search-result__duration">
          {{ result.length.simpleText }}
        </div>
        <div v-if="playlist === true">
          <a class="pli-delete text-white" @click="removeFromPlaylist"> <q-icon name="fas fa-times"/></a>
        </div>
      </div>
    </div>
    <div v-else class="search-result" @click="openPlayer(result)">
      <img
        v-if="getYoutubeImage(result)"
        :src="getYoutubeImage(result)"
        class="search-result__image"
      >
      <div class="d-flex space-between w-100">
        <div>{{ getYoutubeTitle(result) }}</div>
      </div>
      <div v-if="result.length" class="search-result__duration">
        {{ result.length.simpleText }}
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
    getYoutubeImage (result) {
      if (!result) return ''

      if (result.img) return result.img

      if (result.thumbnail?.thumbnails?.[0]?.url) {
        return result.thumbnail.thumbnails[0].url
      }

      if (result.id) {
        return `https://i.ytimg.com/vi/${result.id}/hqdefault.jpg`
      }

      return ''
    },
    getYoutubeTitle (result) {
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

<style>
</style>
