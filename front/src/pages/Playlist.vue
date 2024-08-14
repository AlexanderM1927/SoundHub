<template>
  <q-page>
    <div class="row justify-around">
      <div :class="`custom-dark-bg ${mode === 'adding' ? '' : 'col-md-12' } col-xs-12`">
        <p class="title text-h6 q-ml-md q-mt-md">Mis playlists <a v-if="user" class="text-green" style="cursor: pointer;" @click="agregarPlaylist()"> <q-icon name="add"/> <q-tooltip>Agregar</q-tooltip> </a></p>
        <div v-if="user">
          <div class="q-mx-xs" v-bind:key="result.id" v-for="result in playlists">
            <div v-if="mode === 'adding'">
              <q-btn class="pl-add-btn" round @click="$emit('addToPlaylist', result)" color="positive" icon="add" />
            </div>
            <PlaylistResult :result="result" :tiny="mode === 'adding'" :notmyprofile="false" />
          </div>
        </div>
        <div class="q-mx-md" v-else>
          <p class="default-msg">Para crear playlist, primero debes iniciar sesión.</p>
          <q-btn class="sh-btn" label="Ingresar" to="/login" color="orange"/>
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
  name: 'PagePlaylist',
  mixins: [functions],
  components: { PlaylistResult },
  props: ['mode'],
  data () {
    return {
      playlists: [],
      user: localStorage.getItem('user')
    }
  },
  mounted () {
    this.getMyPlaylists()
  },
  methods: {
    async getMyPlaylists () {
      this.activateLoading()
      try {
        if (localStorage.getItem('user')) {
          const params = {
            user_id: JSON.parse(localStorage.getItem('user')).user_id
          }
          const request = await PlaylistService.getPlaylists(params)
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
          data.user_id = JSON.parse(localStorage.getItem('user')).user_id
          const request = await PlaylistService.store(data)
          if (request.status >= 200 && request.status < 300) this.alert('positive', 'Se agrego la playlist correctamente')
          this.getMyPlaylists()
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
    }
  }
}
</script>

<style>
.pl-add-btn {
  position: absolute;
  width: 40px;
  height: 40px;
  right: 10px;
  margin-top: 7px;
}
</style>
