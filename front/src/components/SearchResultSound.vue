<template>
  <div class="q-mb-sm">
    <!--VIDEO CONTENT-->
    <div
      :class="[
      font==search ? 'container row justify-around' : '']"
      @click="abrirReproductor(result)"
      style="cursor: pointer"
    >
      <!--IMG-->
      <q-img
        class="col-3 col-xs-12 rslt-img"
        :src="getSrcFromBackend(result.sound_thumbnail_url)">
      </q-img>
      <!--TITLE-->
      <div class="rslt_div_title col-md-8 col-xs-12">
        <p class="rslt_title">{{ result.sound_name }}</p>
      </div>
    </div>
    <!--ACTION BUTTONS-->
    <div class="row col-md-3 col-xs-12 rslt-div-btns justify-around">
      <!--ADD TO LIST-->
      <q-btn
        class="col-5 q-ml-sm q-mb-xs"
        @click="agregarSound(result)"
        color="positive"
        icon="add"
      />
      <!--DOWNLOAD-->
      <q-btn
        class="col-5 q-ml-sm q-mb-xs"
        v-if="download"
        @click="
          downloadFile({
            name: result.sound_name,
            sound_file_url: result.sound_file_url,
            type: 'sound',
            url: result.sound_id,
          })"
        color="positive"
        icon="download"
      />
    </div>
    <q-dialog
      v-model="dialogPlaylist"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="width: 800px; max-width: 80vw" class="container">
        <q-card-section>
          <Playlist mode="adding" @addToPlaylist="addToPlaylist"></Playlist>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import SoundPlaylistService from '../services/SoundPlaylistService'
import Playlist from '../pages/Playlist.vue'
import { functions } from '../functions.js'

export default {
  mixins: [functions],
  components: { Playlist },
  name: 'SearchResult',
  props: ['result', 'download', 'font'],
  data () {
    return {
      token: localStorage.getItem('token'),
      dialogPlaylist: false
    }
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
