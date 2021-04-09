<template>
  <q-page>
    <div class="row justify-around">
      <div class="col-md-8 col-xs-12 container">
        <p class="title text-h6 q-ml-md q-mt-md">Mis canciones <a class="text-green" style="cursor: pointer;" @click="uploadSoundModal()"> <q-icon name="unarchive"/> <q-tooltip>Subir</q-tooltip> </a></p>
      </div>
    </div>
  </q-page>
</template>

<script>
import { functions } from '../functions.js'
import SoundService from '../services/SoundService'
import UploadSound from '../components/modals/UploadSound'

export default {
  mixins: [functions],
  name: 'PageSounds',
  data () {
    return {
    }
  },
  methods: {
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
          console.log(request)
          this.disableLoading()
        } catch (error) {
          console.log(error)
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
