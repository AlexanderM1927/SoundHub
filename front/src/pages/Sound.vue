<template>
  <q-page>
    <div :class="`row justify-around`">
      <div :class="`custom-dark-bg col-md-8 col-xs-12 container`">
        <p class="title text-h6 q-ml-md q-mt-md">Mis canciones <a v-if="user" class="text-green" style="cursor: pointer;" @click="uploadSoundModal()"> <q-icon name="unarchive"/> <q-tooltip>Subir</q-tooltip> </a></p>
        <div class="row custom-dark-div">
          <q-btn class="col-2 play-btn" icon="shuffle" @click="getPlaylistAndPlayShuffle()" />
        <q-btn class="col-2 play-btn" icon="play_arrow" @click="getPlaylistAndPlay()" />
        </div>
        <div v-bind:key="file.id" v-for="file in files">
          <SearchResultFile :result="file" :download="false" :tiny="true"/>
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
import SearchResultFile from '../components/SearchResultFile.vue'
import { Plugins, FilesystemDirectory } from '@capacitor/core'

const { Filesystem } = Plugins

export default {
  mixins: [functions],
  components: { SearchResultSound, SearchResultFile },
  name: 'PageSounds',
  data () {
    return {
      sounds: [],
      sound: {},
      files: [],
      user: JSON.parse(localStorage.getItem('user')),
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
          const readFile = await Filesystem.readFile({
            path: 'soundhub/' + ret.files[i],
            directory: FilesystemDirectory.Data
          })
          const arrayBuffer = this.base64ToArrayBuffer(readFile.data)
          const newBlob = new Blob([arrayBuffer], { type: 'audio/mp3' })
          const newUrl = URL.createObjectURL(newBlob)
          const data = {
            sound_name: ret.files[i],
            type: 'device',
            url: newUrl
          }
          this.files.push(data)
        }
      } catch (e) {
        console.error('Unable to read dir', e)
      }
    },
    async getMySounds () {
      try {
        if (localStorage.getItem('user')) {
          const params = {
            user_id: JSON.parse(localStorage.getItem('user')).user_id
          }
          const request = await SoundService.getMySounds(params)
          this.sounds = request.data.data.items
        }
      } catch (error) {
        this.manageErrors(error)
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
          const request = await SoundService.store(formData)
          if (request.status >= 200 && request.status < 300) this.alert('positive', 'Se agrego la canción correctamente')
          this.getMySounds()
          this.disableLoading()
        } catch (error) {
          this.manageErrors(error)
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
      console.log('this.allSounds', this.allSounds)
      this.playPlaylist(this.allSounds)
    },
    getPlaylistAndPlayShuffle () {
      this.allSounds = [...this.files]
      for (let i = 0; i < this.sounds.length; i++) {
        this.allSounds.push(this.sounds[i])
      }
      this.playPlaylist(this.shuffleArray([...this.allSounds]))
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
