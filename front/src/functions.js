import { QSpinnerGears, QSpinnerAudio } from 'quasar'
import { Plugins, FilesystemDirectory } from '@capacitor/core'
import SearchService from './services/SearchService'
import Localbase from 'localbase'
import ViewService from './services/ViewService'

const { Filesystem } = Plugins
export const functions = {
  data () {
    return {
      db: {}
    }
  },
  created () {
    this.db = new Localbase('db')
  },
  mounted () {
  },
  methods: {
    isPlayableItem (result) {
      if (!result || !result.type) return false

      if (result.type === 'video') {
        return Boolean(result.id || result.url)
      }

      if (result.type === 'sound') {
        return Boolean(result.sound_id || result.url)
      }

      if (result.type === 'device') {
        return Boolean(result.url)
      }

      return Boolean(result.url || result.id || result.sound_id)
    },
    getPlayableUrl (result) {
      if (!result) return ''

      if (result.type === 'video') {
        return result.id || result.url || ''
      }

      if (result.type === 'sound') {
        return result.sound_id || result.url || ''
      }

      if (result.type === 'device') {
        return result.url || ''
      }

      return result.url || result.id || result.sound_id || ''
    },
    async prefetchSound (result) {
      if (!result || result.type !== 'video') return

      const url = result.url || result.id
      if (!url) return

      try {
        await SearchService.prefetch({
          type: 'video',
          url
        })
      } catch (error) {
        // Best effort: prefetch must never block playback.
        console.log(error)
      }
    },
    addToCollection (collection, data) {
      this.db.collection(collection).add(data)
        .then(response => {
          console.log('Agregado')
        })
        .catch(error => {
          console.log(error)
        })
    },
    async getDataCollection (collection, by = '', order = '') {
      let answer = []
      if (by === '' && order === '') {
        await this.db.collection(collection).get().then(data => {
          answer = data
        })
      } else {
        await this.db.collection(collection).orderBy(by, order).get().then(data => {
          answer = data
        })
      }
      return answer
    },
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
    async openPlayer (result) {
      if (!result || !result.type) {
        this.alert('warning', 'No se pudo reproducir esta canción')
        return
      }

      if (result.type !== 'device') {
        this.addToCollection('recent', {
          ...result,
          time: Date.now()
        })
      }

      const url = this.getPlayableUrl(result)
      if (!url) {
        this.alert('warning', 'Esta canción no tiene una URL válida')
        return
      }

      let img = result.img || ''
      if (result.type === 'video' && !img) {
        img = result.thumbnail && result.thumbnail.thumbnails && result.thumbnail.thumbnails[0]
          ? result.thumbnail.thumbnails[0].url
          : ''
      } else if (result.type === 'sound' && !img && result.sound_thumbnail_url) {
        img = this.getSrcFromBackend(result.sound_thumbnail_url)
      }

      await this.$store.dispatch('sounds/getSongById', {
        url: url,
        img: img,
        type: result.type,
        title: result.sound_name ? result.sound_name : result.title,
        isFirstOnPlaylist: result.type === 'video',
        urlParent: url
      })
      this.prefetchSound({
        type: result.type,
        url: url
      })
      if (document.getElementById('player') && document.getElementById('player').classList.contains('inactive')) {
        document.getElementById('player').classList.toggle('inactive')
      }
      if (!result.type !== 'device') {
        await ViewService.store({
          sound_id: url,
          view_type: result.type
        })
      }
    },
    async playPlaylist (playlist) {
      const safePlaylist = Array.isArray(playlist) ? playlist.filter(item => this.isPlayableItem(item)) : []

      if (safePlaylist.length === 0) {
        this.alert('warning', 'No hay canciones válidas para reproducir')
        return
      }

      let isNotFirst = false
      let url = ''
      let urlParent = ''
      for (let i = 0; i < safePlaylist.length; i++) {
        const currentSong = safePlaylist[i]
        let img = ''
        // these next methods are to load next sounds while reproduce the first one
        if (i > 0) isNotFirst = true
        if (currentSong.img) img = currentSong.img
        url = this.getPlayableUrl(currentSong)

        if (!url) {
          continue
        }

        if (currentSong.type === 'video' && !img) {
          img = currentSong.thumbnail && currentSong.thumbnail.thumbnails && currentSong.thumbnail.thumbnails[0]
            ? currentSong.thumbnail.thumbnails[0].url
            : ''
        } else if (currentSong.type === 'sound' && !img && currentSong.sound_thumbnail_url) {
          img = this.getSrcFromBackend(currentSong.sound_thumbnail_url)
        }

        if (!isNotFirst) {
          urlParent = url
        }

        try {
          await this.$store.dispatch('sounds/getSongById', {
            url: url,
            isFirstOnPlaylist: !isNotFirst,
            type: currentSong.type,
            playlistMode: true,
            img: img,
            title: currentSong.sound_name ? currentSong.sound_name : currentSong.title,
            urlParent
          })
          if (i < 2) {
            this.prefetchSound({
              type: currentSong.type,
              url: url
            })
          }
          if (!isNotFirst) {
            if (document.getElementById('player') && document.getElementById('player').classList.contains('inactive')) {
              document.getElementById('player').classList.toggle('inactive')
            }
          }
        } catch (error) {
          console.log(error)
          continue
        }
      }
    },
    getSrcFromBackend (url) {
      if (!url) return ''
      if (/^(https?:)?\/\//i.test(url) || url.startsWith('data:')) return url

      return process.env.API_URL.replace('v1/', '') + url.replace('public', '')
    },
    base64ToArrayBuffer (base64) {
      const binaryString = atob(base64)
      const len = binaryString.length
      const bytes = new Uint8Array(len)
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      return bytes.buffer
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
          directory: FilesystemDirectory.Data,
          recursive: false // like mkdir -p
        })
      } catch (error) {
        console.log(error)
      }
    },
    async downloadFile (payload) {
      try {
        this.alert('warning', 'Descargando... En un rato aparecerá en "Mis canciones"')
        const request = await SearchService.download(payload)
        const blob = request.data
        this.convertBlobToBase64(blob).then(async (str) => {
          await this.verifyAndCreateFolder()
          const currentDate = new Date().toLocaleString().replace(/[,:\s\/]/g, '-')
          await Filesystem.writeFile({
            data: str,
            path: 'soundhub/' + payload.title + currentDate + '.mp3',
            directory: FilesystemDirectory.Data
          })
          this.alert('positive', 'Archivo descargado.')
        })
        console.log('Wrote file')
      } catch (e) {
        console.error('Unable to write file', e)
        this.alert('warning', 'Hubo un error en la descarga')
      }
    },
    manageErrors (error) {
      if (error.response.status === 400) {
        if (error.response.data && error.response.data.error[0] && error.response.data.error[0].code) {
          this.alert('negative', error.response.data.error[0].message)
          return 1
        }
      }
      if (error.response.status === 401) { this.goTo('logout') }
      this.alert('negative', error.response.data.error)
    },
    cleanTitle (title) {
      let result
      // clean speciall words and ()[]
      result = title.replace(/(\(|\)|\[|\]|official|oficial|video|audio|lyric|cover|lyrics|versión|version|letra|en vivo)/gi, '')
      result = result.replace(/(\(|\)|\[|\]|clip)/gi, '')
      // change al & for y
      result = result.replace(/&/g, 'y')
      // clean emojis
      result = result.replace(/[\[\]\(\)\u{1F600}-\u{1F64F}\u{2700}-\u{27BF}]+/gu, '')
      result = result.replace(/[\[\]\(\)\p{Emoji_Presentation}\p{Extended_Pictographic}]+/gu, '').trim()
      return result
    }
  }
}
