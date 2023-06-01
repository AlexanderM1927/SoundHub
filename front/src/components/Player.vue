<template>
    <div id='player' class='inactive'>
      <div class='row justify-center vertical-middle'>
        <div class='col-md-1 col-xs-2'>
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
        <div v-if="playlist.length > 0" class='col-md-1 col-xs-2 q-mt-xs'>
          <q-icon
            name="fas fa-step-backward"
            color="pink"
            class="plyr-btn"
            @click="setNewSong('prev')"
          />
        </div>
        <!--SOUND WAVES-->
        <div :class="(playlist.length > 0 ? 'col-md-2 col-xs-4' : 'col-md-10 col-xs-7')">
          <div id='waveform' style="width: 100%;"></div>
        </div>
        <!--NEXT SONG-->
        <div v-if="playlist.length > 0" class="col-md-1 col-xs-2 q-mt-xs">
          <q-icon
            name="fas fa-step-forward"
            color="pink"
            class="plyr-btn"
            @click="setNewSong('next')"
          />
        </div>
        <div v-if="song && (song.payload.type === 'sound' || song.payload.type === 'video')" class="col-md-1 col-xs-2 q-mt-xs">
          <q-icon
            name="fas fa-info"
            size="xs"
            class="plyr-btn plyr-pink"
            @click="openDialogInfo"
          />
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
          <div class="content">
            <div class="text-h5" style="font-weight: bold;">{{ soundInfo.title }}</div>
            <span v-if="soundInfo.type === 'sound'">
              Publicada por:
              <a
                style="
                  text-decoration: none;
                  color: #DEA559;
                  font-weight: bold;
                  cursor: pointer;
                "
                @click="goTo('/profile/' + soundInfo.user_id)"
              >
                {{ soundInfo.user }}
              </a>
            </span>
            <div v-if="soundInfo.type === 'sound' && token">
              <br>
              <q-separator />
              <div class="text-h6">Comentarios:</div>
              <div class="box__comments">
                <comment v-for="(comment, i) in comments" :key="i" :info="comment"></comment>
              </div>
              <q-editor class="full-width" content-class="bg-comment" toolbar-toggle-color="yellow-8" toolbar-bg="pink" v-model="comment" min-height="5rem" />
              <br>
              <q-btn class="full-width" label="Comentar" color="pink" @click="makeComment" />
            </div>
          </div>
        </q-card>
      </q-dialog>
    </div>
</template>

<script>
import WaveSurfer from 'wavesurfer.js'
import SoundService from '../services/SoundService'
import CommentService from '../services/CommentService'
import { functions } from '../functions.js'
import Comment from './Comment.vue'

export default {
  name: 'Player',
  mixins: [functions],
  components: {
    Comment
  },
  data () {
    return {
      wavesurfer: null,
      isLoading: false,
      dialogInfo: false,
      soundInfo: {},
      comment: '',
      token: localStorage.getItem('token'),
      user: JSON.parse(localStorage.getItem('user')),
      comments: [],
      isPlaying: true
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
      if (this.song) this.loadFile(this.song.url)
    }
  },
  methods: {
    async makeComment () {
      if (this.comment.length > 0) {
        const request = await CommentService.store({
          comment: this.comment,
          user_id: this.user.user_id,
          sound_id: this.soundInfo.id
        }, this.token)
        this.comments.unshift(
          {
            user: {
              user_name: this.user.user_name
            },
            comment_msg: request.data.data.comment_msg
          }
        )
        this.comment = ''
        if (request.status === 200) this.alert('positive', 'Comentario enviado')
      } else {
        this.alert('warning', 'Please, introduce some text')
      }
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
      let sound = this.song.payload
      if (this.playlist.length > 0) sound = this.playlist[this.position].payload
      if (sound.type === 'device') {
        console.log('sound device')
        console.log(sound)
      } else {
        try {
          const request = await SoundService.getSoundById(sound)
          const res = request.data.data
          if (sound.type === 'sound') {
            this.soundInfo = {
              title: res.sound_name,
              id: res.sound_id,
              user_id: res.user_id,
              user: res.user.user_name
            }
          } else {
            this.soundInfo = {
              title: res.title,
              id: res.id
            }
          }
          this.soundInfo.type = sound.type
        } catch (error) {
          console.error(error)
        }
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
        console.error(err)
      })
      this.wavesurfer.on('loading', (e) => {
        this.isLoading = true
        if (e === 100) {
          this.isLoading = false
        }
      })
      this.wavesurfer.on('ready', () => {
        this.isLoading = false
        this.disableLoading()
        this.wavesurfer.playPause()
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
        this.setNewSong('next')
      })
    },
    async loadFile (url) {
      if (!this.wavesurfer) this.createWaveSurfer()
      this.wavesurfer.load(url)
      this.activateLoading()
    },
    setNewSong (type) {
      if (this.playlist.length > 0) {
        if (type === 'next' && this.playlist.length > this.position) {
          this.loadFile(this.playlist[this.position + 1].url)
          this.$store.dispatch('sounds/setPosition', (this.position + 1))
        } else {
          if (this.position > 0) {
            this.loadFile(this.playlist[this.position - 1].url)
            this.$store.dispatch('sounds/setPosition', (this.position - 1))
          }
        }
      }
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
