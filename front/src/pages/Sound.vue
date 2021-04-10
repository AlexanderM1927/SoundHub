<template>
  <q-page>
    <div class="row justify-around">
      <div class="col-md-8 col-xs-12 container">
        <p class="title text-h6 q-ml-md q-mt-md">Mis canciones <a class="text-green" style="cursor: pointer;" @click="uploadSoundModal()"> <q-icon name="unarchive"/> <q-tooltip>Subir</q-tooltip> </a></p>
        <div v-bind:key="result.id" v-for="result in sounds">
            <SearchResultSound :result="result" />
            <q-separator></q-separator>
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

export default {
  mixins: [functions],
  components: { SearchResultSound },
  name: 'PageSounds',
  data () {
    return {
      sounds: []
    }
  },
  mounted () {
    this.getMySongs()
  },
  methods: {
    async getMySongs () {
      try {
        const params = {
          user_id: JSON.parse(localStorage.getItem('user')).user_id,
          token: localStorage.getItem('token')
        }
        const request = await SoundService.getMySongs(params)
        this.sounds = request.data.data.items
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
    }
  }
}
</script>
