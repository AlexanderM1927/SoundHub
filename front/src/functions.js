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
        await this.$store.dispatch('sounds/getSongByUrl', {
          url: result.id,
          type: result.type
        })
      } else if (result.type === 'sound') {
        await this.$store.dispatch('sounds/getSongByUrl', {
          url: result.sound_id,
          type: result.type
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
          directory: FilesystemDirectory.Documents,
          recursive: false // like mkdir -p
        })
      } catch (error) {
        console.log(error)
      }
    },
    async downloadFile (payload, files) {
      try {
        const request = await SearchService.getSongByUrl(payload)
        const blob = request.data
        this.convertBlobToBase64(blob).then(async (str) => {
          this.verifyAndCreateFolder()
          await Filesystem.writeFile({
            data: str,
            path: 'soundhub/' + payload.name +  payload.sound_file_url.substr(payload.sound_file_url.lastIndexOf('.') + 1),
            directory: FilesystemDirectory.Documents
          })
        })
        console.log('Wrote file')
      } catch (e) {
        console.error('Unable to write file', e)
      }
    }
  }
}
