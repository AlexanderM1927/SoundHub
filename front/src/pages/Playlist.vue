<template>
  <q-page>
    <div class="row justify-around">
      <div :class="`${mode === 'adding' ? '' : 'col-md-8' } col-xs-12 container`">
        <p class="title text-h6 q-ml-md q-mt-md">Mis playlists <a v-if="token" class="text-green" style="cursor: pointer;" @click="agregarPlaylist()"> <q-icon name="add"/> <q-tooltip>Agregar</q-tooltip> </a></p>
        <div v-bind:key="result.id" v-for="result in playlists">
          <div class="options" v-if="mode === 'adding'">
            <q-btn round @click="$emit('addToPlaylist', result)" color="positive" icon="add" />
          </div>
          <PlaylistResult :result="result" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { functions } from '../functions.js'
import PlaylistService from '../services/PlaylistService'
import AddOrEditPlaylist from '../components/modals/AddOrEditPlaylist.vue'
import PlaylistResult from '../components/PlaylistResult.vue'

export default {
  mixins: [functions],
  components: { PlaylistResult },
  name: 'PagePlaylist',
  props: ['mode'],
  data () {
    return {
      playlists: [],
      token: localStorage.getItem('token')
    }
  },
  mounted () {
    this.getMyPlaylists()
  },
  methods: {
    async getMyPlaylists () {
      this.activateLoading()
      try {
        if (localStorage.getItem('token')) {
          const params = {
            user_id: JSON.parse(localStorage.getItem('user')).user_id,
            token: this.token
          }
          const request = await PlaylistService.getMyPlaylists(params)
          this.playlists = request.data.data
        }
      } catch (error) {
        console.log(error)
      }
      this.disableLoading()
    },
    agregarPlaylist () {
      this.$q.dialog({
        component: AddOrEditPlaylist,
        parent: this,
        mode: 'Crear'
      }).onOk(async (data) => {
        try {
          this.activateLoading()
          data.token = localStorage.getItem('token')
          data.user_id = JSON.parse(localStorage.getItem('user')).user_id
          const request = await PlaylistService.store(data)
          if (request.status >= 200 && request.status < 300) this.alert('positive', 'Se agrego la playlist correctamente')
          this.getMyPlaylists()
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
