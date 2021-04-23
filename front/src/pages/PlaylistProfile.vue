<template>
  <div class="row justify-around">
    <div class="col-md-8 col-xs-12 container">
      <p class="title text-h6 q-ml-md q-mt-md">Canciones de: {{playlist.playlist_name}}</p>
      <q-btn color="orange" icon="play_arrow" @click="getPlaylistAndPlay()" />
      <div v-bind:key="result.id" v-for="result in playlist.sounds">
        <SearchResultSound v-if="result.type === 'sound'" :result="result" />
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
        this.activateLoading()
        const request = await PlaylistService.get({ playlist_id: id })
        this.playlist = request.data.data
        for (let i = 0; i < this.playlist.sounds.length; i++) {
          if (this.playlist.sounds[i].sound_id) {
            this.playlist.sounds[i] = this.playlist.sounds[i].sound
          }
        }
      } catch (error) {
        console.log(error)
      }
      this.disableLoading()
    },
    getPlaylistAndPlay () {
      this.playPlaylist(this.playlist.sounds)
    }
  }
}
</script>
