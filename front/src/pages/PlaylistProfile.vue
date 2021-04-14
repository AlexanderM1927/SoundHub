<template>
  <div class="row justify-around">
    <div class="col-md-8 col-xs-12 container">
      <p class="title text-h6 q-ml-md q-mt-md">Canciones de: {{playlist.playlist_name}}</p>
      <div v-bind:key="result.id" v-for="result in playlist.sounds">
        <SearchResultSound v-if="result.sound_id" :result="result.sound" />
        <SearchResultYoutube v-else :result="result" />
        <q-separator></q-separator>
      </div>
    </div>
  </div>
</template>

<script>
import { functions } from '../functions.js'
import SearchResultSound from '../components/SearchResultSound.vue'
import SearchResultYoutube from '../components/SearchResultYoutube.vue'
import PlaylistService from '../services/PlaylistService'

export default {
  mixins: [functions],
  components: { SearchResultSound, SearchResultYoutube },
  data () {
    return {
      id: this.$route.params.playlist_id,
      playlist: {
        playlist_id: 0,
        sounds: []
      }
    }
  },
  mounted () {
    this.getPlaylistInfo(this.id)
  },
  methods: {
    async getPlaylistInfo (id) {
      try {
        const request = await PlaylistService.get({ playlist_id: id })
        this.playlist = request.data.data
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
