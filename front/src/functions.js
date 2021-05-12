import { QSpinnerGears, QSpinnerAudio } from 'quasar'
import { Plugins, FilesystemDirectory } from '@capacitor/core'
import SearchService from './services/SearchService'

const { Filesystem } = Plugins
export const functions = {
  data () {
  },
  methods: {
    validateForm (array, fun) {
      let isComplete = true
      for (let i = 0; i < array.length; i++) {
        if (array[i] === undefined || array[i] === null || array[i] === '') isComplete = false
      }
      if (!isComplete) {
        this.alert('warning', 'Faltan campos por rellenar')
      } else {
        fun()
      }
      return isComplete
    },
    goTo (location) {
      this.$router.push(location).catch(err => {
        if (err._name === 'NavigationDuplicated') {
          // console.log('it is in page')
        }
      })
    },
    goLocation (url) {
      location.href = url
    },
    alert (type, msg) {
      this.$q.notify({
        position: 'top',
        message: msg,
        color: type
      })
    },
    activateLoading (message = 'Cargando', spinner = 0) {
      var show = {
        message: message
      }

      if (spinner === 1) {
        show.spinner = QSpinnerGears
      } else if (spinner === 2) {
        show.spinner = QSpinnerAudio
      }
      this.$q.loading.show(show)
    },
    disableLoading () {
      this.$q.loading.hide()
    },
    async abrirReproductor (result) {
      this.activateLoading()
      if (result.type === 'video') {
        await this.$store.dispatch('sounds/getSongById', {
          url: result.id,
          type: result.type
        })
      } else if (result.type === 'sound') {
        await this.$store.dispatch('sounds/getSongById', {
          url: result.sound_id,
          type: result.type
        })
      } else if (result.type === 'device') {
        await this.$store.dispatch('sounds/getSongByUrl', {
          url: result.url
        })
      }
      if (document.getElementById('player') && document.getElementById('player').classList.contains('inactive')) {
        document.getElementById('player').classList.toggle('inactive')
      }
      this.disableLoading()
    },
    getSrcFromBackend (url) {
      return process.env.API_URL.replace('v1/', '') + url.replace('public', '')
    },
    convertBlobToBase64 (blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = reject
        reader.onloadend = () => {
          resolve(reader.result)
        }
        reader.readAsDataURL(blob)
      })
    },
    async verifyAndCreateFolder () {
      try {
        await Filesystem.mkdir({
          path: 'soundhub',
          // directory: FilesystemDirectory,
          recursive: false // like mkdir -p
        })
      } catch (error) {
        console.log(error)
      }
    },
    async playPlaylist (playlist) {
      await this.$store.dispatch('sounds/reloadPlaylist')
      this.activateLoading()
      let isNotFirst = false
      for (let i = 0; i < playlist.length; i++) {
        if (i > 0) isNotFirst = true
        if (playlist[i].type === 'video') {
          await this.$store.dispatch('sounds/getSongById', {
            url: playlist[i].id,
            type: playlist[i].type,
            playlistMode: isNotFirst,
            isFirstOnPlaylist: !isNotFirst
          })
          this.disableLoading()
        } else if (playlist[i].type === 'sound') {
          await this.$store.dispatch('sounds/getSongById', {
            url: playlist[i].sound_id,
            type: playlist[i].type,
            playlistMode: isNotFirst,
            isFirstOnPlaylist: !isNotFirst
          })
          this.disableLoading()
        } else if (playlist[i].type === 'device') {
          await this.$store.dispatch('sounds/getSongByUrl', {
            url: playlist[i].url,
            playlistMode: isNotFirst,
            isFirstOnPlaylist: !isNotFirst
          })
          this.disableLoading()
        }
        if (!isNotFirst) {
          if (document.getElementById('player') && document.getElementById('player').classList.contains('inactive')) {
            document.getElementById('player').classList.toggle('inactive')
          }
        }
      }
    },
    async downloadFile (payload) {
      try {
        const request = await SearchService.getSongById(payload)
        const blob = request.data
        this.convertBlobToBase64(blob).then(async (str) => {
          await this.verifyAndCreateFolder()
          await Filesystem.writeFile({
            data: str,
            path: 'soundhub/' + payload.name + payload.sound_file_url.substr(payload.sound_file_url.lastIndexOf('.')),
            // directory: FilesystemDirectory
          })
        })
        console.log('Wrote file')
      } catch (e) {
        console.error('Unable to write file', e)
      }
    }
  }
}
