<template>
  <div class="row justify-around">
    <div class="custom-dark-bg q-pt-sm col-md-8 col-xs-12 container">
      <div class="row custom-dark-div justify-around">
        <p class="col-8 pl-name">{{playlist.playlist_name}}</p>
        <q-btn class="col-2 play-btn" icon="shuffle" @click="getPlaylistAndPlayShuffle()" />
        <q-btn class="col-2 play-btn" icon="play_arrow" @click="getPlaylistAndPlay()" />
      </div>
      <div v-bind:key="result.sound_playlist_id || result.id || result.url || result.sound_id" v-for="result in safeSounds">
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
  computed: {
    safeSounds () {
      return Array.isArray(this.playlist.sounds) ? this.playlist.sounds : []
    }
  },
  mounted () {
    this.getPlaylistInfo(this.id)
  },
  methods: {
    normalizePlaylistSound (sound) {
      if (!sound || typeof sound !== 'object') return null

      const normalized = { ...sound }

      if (!normalized.type && normalized.sound_id) {
        normalized.type = 'sound'
      }

      if (normalized.type === 'sound' && !normalized.url) {
        normalized.url = normalized.sound_id || ''
      }

      if (normalized.type === 'video' && !normalized.url) {
        normalized.url = normalized.id || ''
      }

      if (!normalized.title) {
        normalized.title = normalized.sound_name || normalized.name || 'Sin título'
      }

      return normalized
    },
    async getPlaylistInfo (id) {
      try {
        this.activateLoading()
        const request = await PlaylistService.get({ playlist_id: id })
        const responsePlaylist = request && request.data && request.data.data ? request.data.data : { playlist_name: '', sounds: [] }
        const sounds = Array.isArray(responsePlaylist.sounds) ? responsePlaylist.sounds : []

        this.playlist = {
          ...responsePlaylist,
          sounds: sounds
            .map((item) => {
              const soundItem = item && item.sound ? item.sound : item
              return this.normalizePlaylistSound(soundItem)
            })
            .filter(Boolean)
        }
      } catch (error) {
        console.log(error)
        this.playlist = {
          playlist_id: id,
          playlist_name: '',
          sounds: []
        }
      }
      this.disableLoading()
    },
    getPlaylistAndPlay () {
      this.playPlaylist(this.safeSounds)
    },
    getPlaylistAndPlayShuffle () {
      this.playPlaylist(this.shuffleArray([...this.safeSounds]))
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
