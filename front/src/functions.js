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
      window.location.href = location
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
      await this.$store.dispatch('videos/getSongByUrl', {
        url: result.id
      })
      if (document.getElementById('player') && document.getElementById('player').classList.contains('inactive')) {
        document.getElementById('player').classList.toggle('inactive')
      }
    }
  }
}
