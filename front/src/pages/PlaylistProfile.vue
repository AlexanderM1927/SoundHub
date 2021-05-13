<template>
  <div class="row justify-around">
    <div class="custom-dark-bg col-md-8 col-xs-12 container">
      <div class="row custom-dark-div justify-around">
        <p class="col-10 pl-name">{{playlist.playlist_name}}</p>
        <q-btn class="col-2 play-btn" color="orange" icon="play_arrow" @click="getPlaylistAndPlay()" />
      </div>
      <div v-bind:key="result.id" v-for="result in playlist.sounds">
        <SearchResultSound v-if="result.type === 'sound'" :result="result" :tiny="true" />
        <SearchResultYoutube v-else :result="result" :tiny="true" />
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

<style>
.custom-dark-div {
  margin: 1rem 0.5rem;
  padding: 0.7rem 0.5rem;
  background-color: rgba(54, 54, 59, 0.9);
  border-radius: 3px;
}

.pl-name {
  margin: auto;
  font-family: 'Inter', sans-serif;
  font-size: 1.2rem;
  line-height: 1.4rem;
  color: white;
  text-transform: initial;
}

.play-btn {
  margin: auto;
  max-width: 80px;
  height: 35px;
}

</style>
