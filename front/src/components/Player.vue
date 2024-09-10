<template>
    <div id='player' class='inactive'>
      <div class='row justify-center vertical-middle'>
        <div class='col-md-1 col-xs-2'>
          <div class="row justify-center">
            <!--LOADING ICON-->
            <!-- <q-circular-progress v-if="isLoading" size="72px" indeterminate color="pink" /> -->
            <!--PAUSE BUTTON-->
            <q-icon
              v-if='isPlaying'
              name="fas fa-pause"
              class="plyr-btn plyr-pink"
              @click='pauseSong()'
            />
            <!--PLAY BUTTON-->
            <q-icon
              v-if="!isPlaying"
              name="fas fa-play"
              class="plyr-btn plyr-pink"
              @click="playSong()"
            />
          </div>
        </div>
        <!--PREVIOUS SONG-->
        <div class='col-md-1 col-xs-2'>
          <div class="row justify-center btn-player">
            <q-icon
              name="fas fa-step-backward"
              color="pink"
              class="fs-2"
              @click="setNewSong('prev')"
            />
          </div>
        </div>
        <!--SOUND WAVES-->
        <div :class="'col-md-8 col-xs-4'">
          <div class="player-container">
            <audio ref="audioInput" id="audioInput" controls type="audio/mp3" title="soundhub"></audio>
            <div ref="progressContainer" id="progressBar" class="progressBar">
              <div ref="progress" class="progress" id="progress"></div>
              <div class="duration">
                <span ref="tiempoActual" id="tiempoActual">0:00</span>
                <span ref="tiempoDuracion" id="tiempoDuracion">0:00</span>
              </div>
            </div>
          </div>
          <!---div id='waveform'></div--->
        </div>
        <!--NEXT SONG-->
        <div class="col-md-1 col-xs-2">
          <div class="row justify-center btn-player">
            <q-icon
              name="fas fa-step-forward"
              color="pink"
              class="fs-2"
              @click="setNewSong('next')"
            />
          </div>
        </div>
        <div v-if="soundPlaying && (soundPlaying.payload.type === 'sound' || soundPlaying.payload.type === 'video')" class="col-md-1 col-xs-2 q-mt-xs">
          <div class="row justify-center">
            <q-icon
              name="fas fa-info"
              size="xs"
              class="plyr-btn plyr-pink"
              @click="openDialogInfo"
            />
          </div>
        </div>
      </div>
      <q-dialog
        v-model="dialogInfo"
        transition-show="slide-up"
        transition-hide="slide-down"
        :maximized="true"
      >
        <q-card class="pl-card-body">
          <q-bar>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip class="bg-white text-primary">Close</q-tooltip>
            </q-btn>
          </q-bar>
          <SoundInfo
            :user="user"
            :soundInfo="soundInfo"
            :comments="comments"
            @agregarSound="agregarSound"
            @downloadFile="downloadFile"
          >
          </SoundInfo>
        </q-card>
      </q-dialog>
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
import SoundService from '../services/SoundService'
import CommentService from '../services/CommentService'
import { functions } from '../functions.js'
import Playlist from '../pages/Playlist.vue'
import SoundPlaylistService from '../services/SoundPlaylistService'
import SoundInfo from './SoundInfo'

export default {
  name: 'Player',
  mixins: [functions],
  components: {
    Playlist,
    SoundInfo
  },
  data () {
    return {
      // isLoading: false,
      dialogInfo: false,
      soundInfo: {},
      comment: '',
      user: JSON.parse(localStorage.getItem('user')),
      comments: [],
      isPlaying: true,
      dialogPlaylist: false,
      sound: {},
      soundPlaying: null
    }
  },
  computed: {
    song: {
      get () {
        return this.$store.state.sounds.song
      }
    },
    playlist: {
      get () {
        return this.$store.state.sounds.playlist
      }
    },
    position: {
      get () {
        return this.$store.state.sounds.position
      }
    }
  },
  watch: {
    song () {
      if (this.song) this.loadFile(this.song)
    },
    // playlist () {
    //   if (this.playlist) {
    //     console.log('%c' + this.playlist.map((obj) => {
    //       return obj.payload.title
    //     }).toString(), 'background-color: red; color: white;')
    //   }
    // },
    position () {
      if (this.position) {
        const { url, img, type, title } = this.playlist[this.position].payload // current song
        if (url === window.penultimateSoundRelated) { // if is the penultimate
          this.$store.dispatch('sounds/getSongById', {
            url: url,
            img: img,
            type: type,
            title: title,
            localDownloadId: url,
            playlistMode: true,
            requireRelatedSounds: true
          })
        }
      }
    }
  },
  methods: {
    async addToPlaylist (playlist) {
      try {
        const data = {}
        if (this.sound.type === 'video') {
          data.playlist_id = playlist.playlist_id
          data.youtube_id = this.sound.id
        } else {
          data.playlist_id = playlist.playlist_id
          data.sound_id = this.soundInfo.id
        }
        const request = await SoundPlaylistService.add(data)
        if (request.status >= 200 && request.status < 300) this.alert('positive', 'Canción agregada correctamente')
      } catch (error) {
        this.manageErrors(error)
      }
      this.dialogPlaylist = false
    },
    agregarSound (sound) {
      this.dialogPlaylist = true
      this.sound = sound
    },
    async openDialogInfo () {
      if (!this.dialogInfo) {
        this.dialogInfo = true
        this.activateLoading()
        await this.getInformationSound()
        if (this.soundInfo.type === 'sound') await this.getComments()
        this.disableLoading()
      } else {
        this.dialogInfo = false
      }
    },
    async getComments () {
      try {
        const request = await CommentService.getCommentsBySound({
          id: this.soundInfo.id
        })
        const res = request.data.data
        this.comments = [...res]
      } catch (error) {
        console.error(error)
      }
    },
    async getInformationSound () {
      const sound = this.soundPlaying.payload
      try {
        const request = await SoundService.getSoundById(sound)
        const res = request.data.data
        if (sound.type === 'sound') {
          this.soundInfo = {
            title: res.sound_name,
            id: res.sound_id,
            user_id: res.user_id,
            user: res.user.user_name,
            url: sound.url,
            img: this.getSrcFromBackend(res.sound_thumbnail_url)
          }
        } else {
          this.soundInfo = {
            title: res.title,
            id: res.id,
            url: sound.url,
            img: res.thumbnail.thumbnails[0].url
          }
        }
        this.soundInfo.type = sound.type
      } catch (error) {
        console.error(error)
      }
    },
    loadThumbnail () {
      if ('mediaSession' in navigator) {
        const content = {
          title: this.soundPlaying.payload.title,
          artist: 'SoundHub',
          artwork: [
            { src: this.soundPlaying.payload.img, sizes: '96x96', type: 'image/png' },
            { src: this.soundPlaying.payload.img, sizes: '128x128', type: 'image/png' },
            { src: this.soundPlaying.payload.img, sizes: '192x192', type: 'image/png' },
            { src: this.soundPlaying.payload.img, sizes: '256x256', type: 'image/png' },
            { src: this.soundPlaying.payload.img, sizes: '384x384', type: 'image/png' },
            { src: this.soundPlaying.payload.img, sizes: '512x512', type: 'image/png' }
          ]
        }
        navigator.mediaSession.metadata = new window.MediaMetadata(content)

        navigator.mediaSession.setActionHandler('play', () => {
          this.playSong()
        })
        navigator.mediaSession.setActionHandler('pause', () => {
          this.pauseSong()
        })
        navigator.mediaSession.setActionHandler('previoustrack', () => {
          this.setNewSong('prev')
        })
        navigator.mediaSession.setActionHandler('nexttrack', () => {
          this.setNewSong('next')
        })
        navigator.mediaSession.setActionHandler('seekto', (details) => {
          const currentTime = details.seekTime
          this.$refs.audioInput.currentTime = currentTime
        })
      }
    },
    loadSong (url) {
      this.$refs.audioInput.src = url
      this.$refs.audioInput.load()
      this.$refs.audioInput.addEventListener('timeupdate', (e) => {
        this.updateProgressBar(e)
      })
      this.$refs.audioInput.addEventListener('ended', () => {
        this.setNewSong('next')
      })
      this.$refs.progressContainer.addEventListener('click', (e) => {
        this.setProgressBar(e)
      })
    },
    playSong () {
      this.isPlaying = true
      this.$refs.audioInput.play()
    },
    pauseSong () {
      this.isPlaying = false
      this.$refs.audioInput.pause()
    },
    updateProgressBar (e) {
      if (this.isPlaying) {
        const { duration, currentTime } = e.srcElement
        const progressPercent = (currentTime / duration) * 100
        this.$refs.progress.style.width = `${progressPercent}%`
        const durationHoras = Math.floor(duration / 3600)
        const durationMinutos = Math.floor((duration % 3600) / 60)
        const durationSegundos = Math.floor(duration % 60)

        const durationHorasStr = durationHoras > 0 ? String(durationHoras).padStart(2, '0') + ':' : ''
        const durationMinutosStr = String(durationMinutos).padStart(2, '0') + ':'
        const durationSegundosStr = String(durationSegundos).padStart(2, '0')

        if (!isNaN(durationSegundos)) {
          this.disableLoading()
        } else {
          return
        }

        this.$refs.tiempoDuracion.innerText = durationHorasStr + durationMinutosStr + durationSegundosStr

        const currentHoras = Math.floor(currentTime / 3600)
        const currentMinutos = Math.floor((currentTime % 3600) / 60)
        const currentSegundos = Math.floor(currentTime % 60)

        const currentHorasStr = currentHoras > 0 ? String(currentHoras).padStart(2, '0') + ':' : ''
        const currentMinutosStr = String(currentMinutos).padStart(2, '0') + ':'
        const currentSegundosStr = String(currentSegundos).padStart(2, '0')

        this.$refs.tiempoActual.innerText = currentHorasStr + currentMinutosStr + currentSegundosStr
      }
    },
    setProgressBar (e) {
      const width = this.$refs.progressContainer.clientWidth
      const clickX = e.offsetX
      const { duration } = this.$refs.audioInput
      this.$refs.audioInput.currentTime = (clickX / width) * duration
    },
    async loadFile (sound) {
      this.activateLoading()
      this.soundPlaying = sound
      this.loadSong(sound.url)
      this.playSong()
      this.loadThumbnail()
      await this.getInformationSound()
    },
    isIOS () {
      if (typeof window === 'undefined' || typeof navigator === 'undefined') return false

      return /iPhone|iPad|iPod/i.test(navigator.userAgent || navigator.vendor || (window.opera && window.opera.toString() === '[object Opera]'))
    },
    setNewSong (type) {
      if (type === 'next' && (this.playlist.length - 1) === this.position) {
        this.alert('warning', 'No hay mas canciones en el playlist o están cargando')
        return 0
      }
      if (this.playlist.length > 0) {
        if (type === 'next' && this.playlist.length > this.position) {
          this.$store.dispatch('sounds/setPosition', (this.position + 1))
        } else if (type === 'prev') {
          if (this.position > 0) {
            this.$store.dispatch('sounds/setPosition', (this.position - 1))
          }
        }
        this.loadFile(this.playlist[this.position])
      }
    }
  }
}
</script>

<style lang="scss">

.btn-player {
  height: 100%;
  align-items: center;
}

.plyr-play {
  margin: auto;
}

.plyr-btn {
  vertical-align: center;
  width: 4rem;
  height: 4rem;
  font-size: 2rem;
}

.plyr-pink {
  background-color: #CF2741;
  border-radius: 50%;
  font-weight: 600;
  color: whitesmoke;
}

.pl-card-body {
  background-color: #36363b;
  max-width: 90vw;
  width: 800px;
  overflow: hidden !important;
  color: white;
}

.content {
  color: white;
  height: 90%;
  overflow-y: auto;
  padding: 7px;
}

.bg-comment {
  background: #36363b;
}

.box__comments {
  height: 35vh;
  overflow-y: auto;
}

#audioInput {
  display: none;
}

.player-container {
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
}

.progressBar {
  background: #FFFFFF;
  cursor: pointer;
  width: 100%;
  height: 1rem;
}

.progressBar .progress {
  background: $pink;
  width: 0;
  height: 100%;
  transition: width 0.1s linear;
}

.progressBar .duration {
  position: relative;
  display: flex;
  justify-content: space-between;
  color: white;
  font-size: 0.7rem;
}
</style>
