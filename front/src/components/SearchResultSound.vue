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
    <div v-if="playlist === true">
      <div class="zero">
        <a class="pli-delete text-black" @click="removeFromPlaylist"> <q-icon name="fas fa-times"/></a>
      </div>
    </div>
    <!--ACTION BUTTONS-->
    <div v-if="tiny === false">
      <div class="row col-md-3 col-xs-12 rslt-div-btns justify-around">
        <!--ADD TO LIST-->
        <q-btn
          class="col-5 q-ml-sm q-mb-xs"
          @click="agregarSound(result)"
          color="pink"
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
          color="pink"
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
  props: ['result', 'download', 'tiny', 'playlist'],
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
    },
    async removeFromPlaylist () {
      try {
        const data = {
          sound_playlist_id: this.result.sound_playlist_id,
          token: this.token
        }
        const request = await SoundPlaylistService.remove(data)
        if (request.status >= 200 && request.status < 300) {
          this.alert('positive', 'Canción eliminada del playlist correctamente')
          this.$destroy()
          this.$el.parentNode.removeChild(this.$el)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/*BIG VERSION STYLES */
.rslt_div_title{
  background-color: #36363b;
  padding: 0.4rem 0.4rem 0px 0.4rem;
}

.rslt_title {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 1.05rem;
  color: #f5f5f5;
  line-height: 1.25rem !important;
}

.rlst-img {
  height: 100px !important;
  margin: auto;
}

.rslt-img-text {
  position: absolute;
  padding: 2px;
  bottom: -18px;
  background-color: rgba(0, 0, 0, 0.75);

  text-align: center;
  color: #ffffff;
}

.rslt-div-btns {
  background-color: #36363b;
  padding-bottom: 10px;
}

/*TINY VERSION STYLES*/
.pli-img {
  height: 80px !important;
  margin: auto;
}

.pli-text {
  padding: 0 7% 0 8px;
  font-family: 'Inter', sans-serif;
  font-size: .9rem;
  color: white;
}

.pli-delete {
  position: relative;
  top: -109px;
  left: 99vw;
  margin-left: -2rem;
  width: 1.5rem;
  height: 1.8rem;
  font-size: 1.4rem;
  background-color: #FF9800;
  cursor: pointer;
  z-index: 5;
}

/*PLAYLIST CARD STYLES*/
.pl-card-body {
  background-color: #36363b;
  max-width: 90vw;
  width: 800px;
  overflow: hidden !important;
}
</style>
