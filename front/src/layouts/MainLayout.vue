<template>
  <q-layout view='hHh Lpr lFf'>
    <Navbar />

    <q-page-container>
      <router-view />
    </q-page-container>
    <div id='player' class='inactive'>
      <div class='row'>
        <div class='col-4'>
          <center>
            <q-btn
              v-if='isPlaying'
              color='primary'
              round
              icon='pause'
              size='xl'
              @click='wavesurfer.playPause()'
            />
            <q-btn
              v-if="!isPlaying && !isLoading"
              color="primary"
              round
              icon="play_arrow"
              size="xl"
              @click="wavesurfer.playPause()"
            />
          </center>
        </div>
        <div class='col-8'>
          <q-btn
            color="primary"
            flat
            round
            icon="fast_rewind"
            size="xl"
            @click="wavesurfer.skipBackward(1)"
          />
          <div id='waveform' style="float: left;"></div>
            <q-btn
            color="primary"
            flat
            round
            icon="fast_forward"
            size="xl"
            @click="wavesurfer.skipForward(1)"
          />
        </div>
      </div>
    </div>
  </q-layout>
</template>

<script>
import WaveSurfer from 'wavesurfer.js'
import Navbar from 'components/Navbar.vue'
import { functions } from '../functions.js'

export default {
  name: 'MainLayout',
  components: { Navbar },
  mixins: [functions],
  data () {
    return {
      leftDrawerOpen: false,
      wavesurfer: null,
      isLoading: false
    }
  },
  props: ['view'],
  computed: {
    isPlaying () {
      if (!this.wavesurfer) return false
      return this.wavesurfer.isPlaying()
    },
    song: {
      get () {
        return this.$store.state.videos.song
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
        waveColor: 'black',
        // progressColor: 'hsla(200, 100%, 30%, 0.5)',
        cursorColor: '#000',
        barWidth: 1
      })
      this.wavesurfer.on('error', err => {
        console.error(err)
        this.disableLoading()
        this.$q.notify({ message: err })
      })
      this.wavesurfer.on('loading', () => {
        this.activateLoading()
      })
      this.wavesurfer.on('ready', () => {
        this.disableLoading()
      })
    },
    loadFile (url) {
      if (!this.wavesurfer) this.createWaveSurfer()
      this.wavesurfer.load(url)
      console.log(this.wavesurfer)
    }
  }
}
</script>
