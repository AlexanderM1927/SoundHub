<template>
    <div id='player' class='inactive'>
      <div class='row justify-center vertical-middle'>
        <div class='col-md-1 col-xs-2'>
          <div class="row justify-center">
            <!--LOADING ICON-->
            <q-circular-progress v-if="isLoading" size="72px" indeterminate color="pink" />
            <!--PAUSE BUTTON-->
            <q-icon
              v-if='isPlaying'
              name="fas fa-pause"
              class="plyr-btn plyr-pink"
              @click='wavesurfer.playPause()'
            />
            <!--PLAY BUTTON-->
            <q-icon
              v-if="!isPlaying && !isLoading"
              name="fas fa-play"
              class="plyr-btn plyr-pink"
              @click="wavesurfer.playPause()"
            />
          </div>
        </div>
        <!--PREVIOUS SONG-->
        <div class='col-md-1 col-xs-2'>
          <div class="row justify-center">
            <q-icon
              name="fas fa-step-backward"
              color="pink"
              class="plyr-btn"
              @click="setNewSong('prev')"
            />
          </div>
        </div>
        <!--SOUND WAVES-->
        <div :class="'col-md-8 col-xs-4'">
          <div id='waveform'></div>
          <div id="audioBox"><audio id="audioInput" controls type="audio/mp3" title="soundhub"></audio></div>
        </div>
        <!--NEXT SONG-->
        <div class="col-md-1 col-xs-2">
          <div class="row justify-center">
            <q-icon
              name="fas fa-step-forward"
              color="pink"
              class="plyr-btn"
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
import WaveSurfer from 'wavesurfer.js'
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
      wavesurfer: null,
      isLoading: false,
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
    playlist () {
      if (this.playlist.length > 0) {
        console.log(`%cthis.playlist: ${this.playlist.map((pl) => {
          return pl.payload.title
        }).toString()}`, 'background-color:red;color:#fff;padding: 5px 10px;')
      }
    },
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
    createWaveSurfer () {
      this.wavesurfer = WaveSurfer.create({
        container: '#waveform',
        hideScrollbar: true,
        waveColor: '#F5F5F5',
        progressColor: '#CF2741',
        cursorColor: '#fff',
        barWidth: 3,
        backend: 'MediaElement'
      })
      this.wavesurfer.on('error', err => {
        this.isLoading = false
        console.error(err)
      })
      this.wavesurfer.on('loading', (e) => {
        this.isLoading = true
        if (e > 70) {
          this.isLoading = false
          this.disableLoading()
        }
        // console.log('e', e)
      })
      this.wavesurfer.on('ready', () => {
        this.isLoading = false
        this.disableLoading()
        setTimeout(() => {
          this.wavesurfer.playPause()
        }, 2000)
        this.loadThumbnail()
      })
      this.wavesurfer.on('play', () => {
        this.isLoading = false
        this.isPlaying = true
      })
      this.wavesurfer.on('pause', () => {
        this.isLoading = false
        this.isPlaying = false
      })
      this.wavesurfer.on('finish', () => {
        this.isLoading = false
        this.setNewSong('next')
      })
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
          this.wavesurfer.playPause()
        })
        navigator.mediaSession.setActionHandler('pause', () => {
          this.wavesurfer.playPause()
        })
        navigator.mediaSession.setActionHandler('previoustrack', () => {
          this.setNewSong('prev')
        })
        navigator.mediaSession.setActionHandler('nexttrack', () => {
          this.setNewSong('next')
        })
        navigator.mediaSession.setActionHandler('seekto', (details) => {
          const currentTime = details.seekTime
          this.wavesurfer.seekTo(currentTime / this.wavesurfer.getDuration())
        })
      }
    },
    async loadFile (sound) {
      if (!this.wavesurfer) {
        this.createWaveSurfer()
      }
      this.soundPlaying = sound
      this.wavesurfer.load(sound.url)
      this.activateLoading()
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

<style>
#audioBox {
  display: none;
}

.plyr-play {
  margin: auto;
}

.asa {
  margin: auto 0;
}

.plyr-btn {
  margin: auto;
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
</style>
