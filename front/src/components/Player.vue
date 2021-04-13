<template>
    <div id='player' class='inactive'>
      <div class='row'>
        <div class='col-md-4 col-xs-2'>
          <center>
            <q-circular-progress v-if="isLoading" size="72px" indeterminate color="negative" />
            <q-btn
              v-if='isPlaying'
              color='negative'
              round
              icon='pause'
              size='xl'
              @click='wavesurfer.playPause()'
            />
            <q-btn
              v-if="!isPlaying && !isLoading"
              color="negative"
              round
              icon="play_arrow"
              size="xl"
              @click="wavesurfer.playPause()"
            />
          </center>
        </div>
        <div class='col-md-1 col-xs-2'>
          <q-btn
            color="negative"
            flat
            round
            icon="fast_rewind"
            size="xl"
            @click="wavesurfer.skipBackward(1)"
          />
        </div>
        <div class="col-md-6 col-xs-6">
          <div id='waveform' style="width: 100%;"></div>
        </div>
        <div class="col-md-1 col-xs-2">
          <q-btn
            color="negative"
            flat
            round
            icon="fast_forward"
            size="xl"
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
        waveColor: 'white',
        progressColor: 'red(200, 100%, 30%, 0.5)',
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
    },
    async loadFile (url) {
      if (!this.wavesurfer) this.createWaveSurfer()
      this.wavesurfer.load(url)
    }
  }
}
</script>
