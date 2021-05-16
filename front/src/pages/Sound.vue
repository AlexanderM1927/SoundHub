<template>
  <q-page>
    <div :class="`row justify-around`">
      <div :class="`custom-dark-bg col-md-8 col-xs-12 container`">
        <p class="title text-h6 q-ml-md q-mt-md">Mis canciones <a v-if="token" class="text-green" style="cursor: pointer;" @click="uploadSoundModal()"> <q-icon name="unarchive"/> <q-tooltip>Subir</q-tooltip> </a></p>
        <div class="row custom-dark-div">
          <p class="snd-subtitle col-9">Reproducir en orden</p>
          <q-btn class="play-btn col-3" color="orange" icon="play_arrow" @click="getPlaylistAndPlay()" />
        </div>
        <div v-bind:key="result.id" v-for="result in files">
          <ResultSoundDevice :result="result" />
        </div>
        <div v-bind:key="result.id" v-for="result in sounds">
          <SearchResultSound :result="result" :download="false" :tiny="true"/>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { functions } from '../functions.js'
import SoundService from '../services/SoundService'
import UploadSound from '../components/modals/UploadSound'
import SearchResultSound from '../components/SearchResultSound.vue'
import ResultSoundDevice from '../components/ResultSoundDevice.vue'
import { Plugins, FilesystemDirectory, Capacitor } from '@capacitor/core'

const { Filesystem } = Plugins
export default {
  mixins: [functions],
  components: { SearchResultSound, ResultSoundDevice },
  name: 'PageSounds',
  data () {
    return {
      sounds: [],
      token: localStorage.getItem('token'),
      sound: {},
      files: [],
      allSounds: []
    }
  },
  mounted () {
    this.getMySoundsFromDevice()
    this.getMySounds()
  },
  methods: {
    async getMySoundsFromDevice () {
      try {
        this.activateLoading()
        const ret = await Filesystem.readdir({
          path: 'soundhub',
          directory: FilesystemDirectory.Data
        })
        for (let i = 0; i < ret.files.length; i++) {
          const getUri = await Filesystem.getUri({
            path: 'soundhub/' + ret.files[i],
            directory: FilesystemDirectory.Data
          })
          const path = getUri.uri
          const url = await Capacitor.convertFileSrc(path)
          const data = {
            sound_name: ret.files[i],
            type: 'device',
            url: url
          }
          this.files.push(data)
          // this.sounds.push(data)
        }
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
      this.disableLoading()
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
    getPlaylistAndPlay () {
      this.allSounds = [...this.files]
      for (let i = 0; i < this.sounds.length; i++) {
        this.allSounds.push(this.sounds[i])
      }
      this.playPlaylist(this.allSounds)
    }
  }
}
</script>

<style scoped>
.custom-dark-div {
  margin: 1rem 0.5rem;
  padding: 0.7rem 0.5rem;
  background-color: rgba(54, 54, 59, 0.9);
  border-radius: 3px;
}

.snd-subtitle {
  margin: auto;
  font-family: 'Inter', sans-serif;
  font-size: 1.15rem;
  color: whitesmoke;
}

.play-btn {
  margin: auto;
  max-width: 80px;
  height: 35px;
}
</style>
