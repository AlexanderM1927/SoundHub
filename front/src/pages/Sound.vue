<template>
  <q-page>
    <div :class="`row justify-around`">
      <div :class="`col-md-8 col-xs-12 container`">
        <p class="title text-h6 q-ml-md q-mt-md">Mis canciones <a v-if="token" class="text-green" style="cursor: pointer;" @click="uploadSoundModal()"> <q-icon name="unarchive"/> <q-tooltip>Subir</q-tooltip> </a></p>
        <div v-bind:key="result.id" v-for="result in sounds">
            <SearchResultSound :result="result" />
            <q-btn round @click="agregarSound(result)" color="positive" icon="add" />
            <q-btn round @click="downloadFile({sound_file_url: result.sound_file_url, type: 'sound', url: result.sound_id}, files)" color="positive" icon="download" />
            <q-separator></q-separator>
          </div>
          {{files}}
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
  </q-page>
</template>

<script>
import { functions } from '../functions.js'
import SoundService from '../services/SoundService'
import UploadSound from '../components/modals/UploadSound'
import Playlist from './Playlist.vue'
import SearchResultSound from '../components/SearchResultSound.vue'
import SoundPlaylistService from '../services/SoundPlaylistService'
import { Plugins } from '@capacitor/core'

const { Storage } = Plugins
export default {
  mixins: [functions],
  components: { SearchResultSound, Playlist },
  name: 'PageSounds',
  data () {
    return {
      sounds: [],
      token: localStorage.getItem('token'),
      dialogPlaylist: false,
      sound: {},
      files: []
    }
  },
  mounted () {
    this.getMySounds()
    this.getMySoundsFromDevice()
  },
  methods: {
    async getMySoundsFromDevice () {
      try {
        const files = await Storage.get({ key: 'soundhub' })
        this.files = JSON.parse(files.value) || []
      } catch (e) {
        console.error('Unable to read dir', e)
      }
    },
    async getMySounds () {
      try {
        if (localStorage.getItem('token')) {
          const params = {
            user_id: JSON.parse(localStorage.getItem('user')).user_id,
            token: this.token
          }
          const request = await SoundService.getMySounds(params)
          this.sounds = request.data.data.items
        }
      } catch (error) {
        console.log(error)
      }
    },
    async uploadSoundModal () {
      this.$q.dialog({
        component: UploadSound,
        parent: this
      }).onOk(async (data) => {
        try {
          this.activateLoading()
          const formData = new FormData()
          formData.append('sound_thumbnail_url', data.sound_thumbnail_url)
          formData.append('sound_file_url', data.sound_file_url)
          formData.append('sound_name', data.sound_name)
          formData.append('user_id', JSON.parse(localStorage.getItem('user')).user_id)
          const token = localStorage.getItem('token')
          const request = await SoundService.store(formData, token)
          if (request.status >= 200 && request.status < 300) this.alert('positive', 'Se agrego la canción correctamente')
          this.getMySounds()
          this.disableLoading()
        } catch (error) {
          for (let i = 0; i < error.response.data.error.errors.length; i++) {
            this.alert('negative', error.response.data.error.errors[i].message)
          }
          this.disableLoading()
        }
      }).onCancel(() => {
        console.log('Cancel')
      }).onDismiss(() => {
        console.log('Called on OK or Cancel')
      })
    },
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
