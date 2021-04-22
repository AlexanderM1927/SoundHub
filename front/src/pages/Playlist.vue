<template>
  <q-page>
    <div class="row justify-around">
      <div class="row col-md-8 col-xs-12 justify-around">
        <!--TITLE-->
        <p class="row col-11 title text-h6 q-mt-md q-pa-sm bg-grey">
          Mis playlists
          <a
            v-if="token"
            class="text-green"
            style="cursor: pointer"
            @click="agregarPlaylist()"
          >
            <q-icon name="add" />
            <q-tooltip>Agregar</q-tooltip>
          </a>
        </p>
        <!--CONTENT-->
        <div
          class="row col-11 justify-around"
          v-bind:key="result.id"
          v-for="result in playlists"
        >
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
