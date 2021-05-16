<template>
  <div class="q-mb-sm">
    <!--VIDEO CONTENT-->
    <div
      :class="[tiny ? 'row custom-dark-div' : 'row justify-around']"
      @click="abrirReproductor(result)"
    >
      <!--IMG-->
      <q-img
        :class="[tiny ? 'pli-img col-3' : 'col-3 col-xs-12 rslt-img']"
        :src="getSrcFromBackend(result.sound_thumbnail_url)"
      >
      </q-img>
      <!--TITLE-->
      <div :class="[tiny ? 'col-9' : 'rslt_div_title col-12']">
        <p :class="[tiny ? 'pli-text' : 'rslt_title']">{{ result.sound_name }}</p>
      </div>
    </div>
    <!--REMOVE BUTTON-->
    <div v-if="tiny === true">
      <div class="zero">
        <a class="pli-delete text-black" @click="pintar(true)"> <q-icon name="fas fa-times"/></a>
      </div>
    </div>
    <!--ACTION BUTTONS-->
    <div v-if="tiny === false">
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
            })
          "
          color="positive"
          icon="download"
        />
      </div>
    </div>
    <q-dialog
      v-model="dialogPlaylist"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="pl-card-body">
        <Playlist mode="adding" @addToPlaylist="addToPlaylist"></Playlist>
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
  props: ['result', 'download', 'tiny'],
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
