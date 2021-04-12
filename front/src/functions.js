import { QSpinnerGears, QSpinnerAudio } from 'quasar'
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
      const song = this.$store.state.sounds.song
      if (song) {
        this.$q.dialog({
          title: 'Cambiar de canción',
          message: 'Actualmente tienes una canción, deseas cambiarla?',
          cancel: true,
          persistent: true,
          result: result,
          dark: true
        }).onOk(async () => {
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
        }).onOk(() => {
          // console.log('>>>> second OK catcher')
        }).onCancel(() => {
          // console.log('>>>> Cancel')
        }).onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        })
      } else {
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
      }
    },
    cerrarReproductor () {
      if (document.getElementById('player') && !document.getElementById('player').classList.contains('inactive')) {
        document.getElementById('player').classList.toggle('inactive')
      }
    },
    getSrcFromBackend (url) {
      return process.env.API_URL.replace('v1/', '') + url.replace('public', '')
    }
  }
}
