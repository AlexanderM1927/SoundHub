<template>
  <div class="row justify-around">
    <div class="custom-dark-bg q-pt-sm col-md-8 col-xs-12 container">
      <div class="row custom-dark-div justify-around">
        <p class="col-8 pl-name">{{playlist.playlist_name}}</p>
        <q-btn class="col-2 play-btn" icon="shuffle" @click="getPlaylistAndPlayShuffle()" />
        <q-btn class="col-2 play-btn" icon="play_arrow" @click="getPlaylistAndPlay()" />
      </div>
      <div v-bind:key="result.id" v-for="result in playlist.sounds">
        <SearchResultSound v-if="result.type === 'sound'" :result="result" :tiny="true" :playlist="true" />
        <SearchResultYoutube v-else :result="result" :tiny="true" :playlist="true" />
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
  name: 'PlaylistProfile',
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
    },
    getPlaylistAndPlayShuffle () {
      this.playPlaylist(this.shuffleArray([...this.playlist.sounds]))
    },
    shuffleArray (array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
      }
      return array
    }

  }
}
</script>

<style>
.pl-name {
  margin: auto;
  font-family: 'Inter', sans-serif;
  font-size: 1.2rem;
  line-height: 1.4rem;
  color: white;
  text-transform: initial;
}

</style>
