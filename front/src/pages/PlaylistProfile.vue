<template>
  <div class="row justify-around">
    <div class="col-md-8 col-xs-12 container">
      <p class="title text-h6 q-ml-md q-mt-md">Canciones de: {{playlist.playlist_name}} <a v-if="token" class="text-green" style="cursor: pointer;" @click="agregarSound()"> <q-icon name="add"/> <q-tooltip>Agregar</q-tooltip> </a></p>
      <div v-bind:key="result.id" v-for="result in playlist.sounds">
        <SearchResultSound :result="result.sound" />
        <q-separator></q-separator>
      </div>
    </div>
    <q-dialog
      v-model="dialogSounds"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="width: 800px; max-width: 80vw;" class="container">
        <q-card-section>
          <Sound mode= 'playlist' @addSound="addSound"></Sound>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { functions } from '../functions.js'
import SearchResultSound from '../components/SearchResultSound.vue'
import Sound from './Sound.vue'
import PlaylistService from '../services/PlaylistService'
import SoundPlaylistService from '../services/SoundPlaylistService'

export default {
  mixins: [functions],
  components: { SearchResultSound, Sound },
  data () {
    return {
      playlist: {
        playlist_id: 0,
        sounds: []
      },
      dialogSounds: false,
      token: localStorage.getItem('token')
    }
  },
  mounted () {
    this.getPlaylistInfo(this.$route.params.playlist_id)
  },
  methods: {
    async getPlaylistInfo (id) {
      try {
        const request = await PlaylistService.get({ playlist_id: id })
        this.playlist = request.data.data
        for (let i = 0; i < this.playlist.sounds.length; i++) {
          this.playlist.sounds[i].sound.type = 'sound'
        }
      } catch (error) {
        console.log(error)
      }
    },
    agregarSound () {
      this.dialogSounds = true
    },
    async addSound (sound) {
      try {
        const data = {
          playlist_id: this.playlist.playlist_id,
          sound_id: sound.sound_id,
          token: this.token
        }
        const request = await SoundPlaylistService.add(data)
        if (request.status >= 200 && request.status < 300) this.alert('positive', 'Canción agregada correctamente')
      } catch (error) {
        console.log(error)
      }
      this.dialogSounds = false
    }
  }
}
</script>
