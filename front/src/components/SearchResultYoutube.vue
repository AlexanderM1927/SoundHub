<template>
    <div>
        <div @click="abrirReproductor(result)" style="cursor: pointer;" class="container row search_item justify-around">
            <q-img :src="result.thumbnail.thumbnails[0].url" class="col-3 q-my-sm"></q-img>
            <div class="content q-my-sm col-8" >
                <p class="item_title item_font">{{result.title}}</p>
                <p class="item_font" v-if="result.length.accessibility">{{result.length.accessibility.accessibilityData.label}}</p>
            </div>
        </div>
        <q-btn round @click="agregarSound(result)" color="positive" icon="add" />
        <q-btn round @click="downloadFile({name: result.title, sound_file_url: '.mp3', type: 'video', url: result.id})" color="positive" icon="download" />
        <q-dialog
        v-model="dialogPlaylist"
        transition-show="slide-up"
        transition-hide="slide-down"
        >
            <q-card style="width: 800px; max-width: 80vw;" class="container">
                <q-card-section>
                <Playlist mode= 'adding' @addToPlaylist="addToPlaylist"></Playlist>
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
  props: ['result'],
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
    color: #E83845;
}

.item_title {
    font-size: 20px;
    font-weight: 500;
    line-height: 20px !important;
}

.item_font {
    color: #f5f5f5;
    font-family: 'Quicksand', sans-serif;
}

</style>
