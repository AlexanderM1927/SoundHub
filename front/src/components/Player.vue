<template>
    <div id='player' class='inactive'>
      <div class='row justify-center vertical-middle'>
        <div class='col-md-4 col-xs-2'>
          <center class="row q-mt-xs">
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
          </center>
        </div>
        <!--PREVIOUS SONG-->
        <div class='col-md-1 col-xs-2 q-mt-xs'>
          <q-icon
            name="fas fa-backward"
            color="pink"
            class="plyr-btn"
            @click="wavesurfer.skipBackward(1)"
          />
        </div>
        <!--SOUND WAVES-->
        <div class="col-md-2 col-xs-6">
          <div id='waveform' style="width: 100%;"></div>
        </div>
        <!--NEXT SONG-->
        <div class="col-md-1 col-xs-2 q-mt-xs">
          <q-icon
            name="fas fa-forward"
            color="pink"
            class="plyr-btn"
            @click="wavesurfer.skipForward(1)"
          />
        </div>
      </div>
    </div>
</template>

<script>
import WaveSurfer from 'wavesurfer.js'
import { functions } from '../functions.js'

export default {
  name: 'MainLayout',
  mixins: [functions],
  data () {
    return {
      wavesurfer: null,
      isLoading: false
    }
  },
  computed: {
    isPlaying () {
      if (!this.wavesurfer) return false
      return this.wavesurfer.isPlaying()
    },
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
      this.loadFile(this.song)
    }
  },
  methods: {
    createWaveSurfer () {
      this.wavesurfer = WaveSurfer.create({
        container: '#waveform',
        hideScrollbar: true,
        waveColor: '#F5F5F5',
        progressColor: '#CF2741',
        cursorColor: '#fff',
        barWidth: 3
      })
      this.wavesurfer.on('error', err => {
        console.error(err)
        this.disableLoading()
        this.$q.notify({ message: err })
      })
      this.wavesurfer.on('loading', () => {
        this.isLoading = true
        this.activateLoading()
      })
      this.wavesurfer.on('ready', () => {
        this.isLoading = false
        this.wavesurfer.playPause()
        this.disableLoading()
      })
      this.wavesurfer.on('finish', () => {
        if (this.playlist.length > 0 && this.playlist.length > this.position) {
          this.loadFile(this.playlist[this.position])
          this.$store.dispatch('sounds/setPosition', (this.position + 1))
        }
      })
    },
    async loadFile (url) {
      if (!this.wavesurfer) this.createWaveSurfer()
      this.wavesurfer.load(url)
    }
  }
}
</script>

<style>
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
</style>
