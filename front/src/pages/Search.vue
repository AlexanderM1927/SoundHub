<template>
  <div class="row justify-around">
    <div class="col-md-8 col-xs-12 container">
      <p class="title text-h6 q-ml-md q-mt-md">RESULTADOS DE LA BÚSQUEDA</p>
      <div v-bind:key="result.id" v-for="result in searchResults">
        <SearchResultYoutube v-if="result.type === 'video'" :result="result" />
        <SearchResultSound v-else-if="result.type === 'sound'" :result="result" />
        <q-btn round @click="agregarSound(result)" color="positive" icon="add" />
        <q-separator></q-separator>
      </div>
    </div>
    <q-dialog
      v-model="dialogPlaylist"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="width: 800px; max-width: 80vw;" class="container">
        <q-card-section>
          <Playlist mode= 'adding' @addToPlaylist="addToPlaylist"></Playlist>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { functions } from '../functions.js'
import SearchResultYoutube from '../components/SearchResultYoutube.vue'
import SearchResultSound from '../components/SearchResultSound.vue'
import Playlist from './Playlist.vue'
import SoundPlaylistService from '../services/SoundPlaylistService'

export default {
  mixins: [functions],
  components: { SearchResultYoutube, SearchResultSound, Playlist },
  data () {
    return {
      token: localStorage.getItem('token'),
      dialogPlaylist: false,
      sound: {}
    }
  },
  computed: {
    searchResults: {
      get () {
        return this.$store.state.sounds.searchResults
      }
    },
    loading: {
      get () {
        return this.$store.state.sounds.loading
      }
    }
  },
  watch: {
    loading () {
      if (this.loading === true) {
        this.activateLoading()
      } else {
        this.disableLoading()
      }
    }
  },
  async mounted () {
    await this.$store.dispatch('sounds/getItemsByName', {
      name: this.$route.params.name
    })
  },
  methods: {
    agregarSound (sound) {
      this.dialogPlaylist = true
      this.sound = sound
    },
    async addToPlaylist (playlist) {
      try {
        const data = {}
        if (this.sound.type === 'video') {
          data.playlist_id = playlist.playlist_id
          data.youtube_id = this.sound.id
          data.token = this.token
        } else {
          data.playlist_id = playlist.playlist_id
          data.sound_id = this.sound.sound_id
          data.token = this.token
        }
        const request = await SoundPlaylistService.add(data)
        if (request.status >= 200 && request.status < 300) this.alert('positive', 'Canción agregada correctamente')
      } catch (error) {
        console.log(error)
      }
      this.dialogPlaylist = false
    }
  }
}
</script>
