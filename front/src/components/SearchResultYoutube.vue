<template>
  <div>
    <!--VIDEO CONTENT-->
    <div
      @click="abrirReproductor(result)"
      style="cursor: pointer"
      class="container row justify-around"
    >
      <q-img
        :src="result.thumbnail.thumbnails[0].url"
        class="col-md-3 col-xs-12 rslt-img">
          <p class="rslt-img-text" v-if="result.length.accessibility">
            {{ result.length.simpleText }}
          </p>
      </q-img>
      <div class="content col-md-8 col-xs-12">
        <p class="item_title item_font">{{ result.title }}</p>
      </div>
    </div>
    <!--ACTION BUTTONS-->
    <div>
      <q-btn
        class="q-ml-sm q-mb-xs"
        round
        @click="agregarSound(result)"
        color="positive"
        icon="add" />
      <q-btn
        class="q-ml-sm q-mb-xs"
        v-if="download"
        round
        @click="
          downloadFile({
            name: result.title,
            sound_file_url: '.mp3',
            type: 'video',
            url: result.id,
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
  props: ['result', 'download'],
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

<style>
.content {
  color: #e83845;
}

.item_title {
  font-family: "Inter", sans-serif;
  font-weight: 500;
  font-size: 1.1rem;
  color: #f5f5f5;
  line-height: 1.2rem !important;
}

.rlst-img {
  height: 100px !important;
}

.rslt-img-text {
  position: absolute;
  bottom: -18px;
  background-color: rgba(0, 0, 0, 0.8);

  text-align: center;
  color: #ffffff;
}
</style>
