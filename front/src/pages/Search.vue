<template>
  <div class="row justify-around">
    <div class="col-md-8 col-xs-12 search-bg container">
      <p class="title text-h6 q-ml-md q-mt-md">Resultados</p>
      <div v-bind:key="result.id" v-for="result in searchResults">
        <SearchResultUser v-if="result.type === 'user'" :result="result" :download="true" :tiny="false" />
        <SearchResultPlaylist v-if="result.type === 'playlist'" :result="result" :download="true" :tiny="false" />
        <SearchResultYoutube v-else-if="result.type === 'video'" :result="result" :download="true" :tiny="false" />
        <SearchResultSound v-else-if="result.type === 'sound'" :result="result" :download="true" :tiny="false" />
      </div>
    </div>
  </div>
</template>

<script>
import { functions } from '../functions.js'
import SearchResultYoutube from '../components/SearchResultYoutube.vue'
import SearchResultSound from '../components/SearchResultSound.vue'
import SearchResultUser from '../components/SearchResultUser.vue'
import SearchResultPlaylist from '../components/SearchResultPlaylist.vue'

export default {
  mixins: [functions],
  components: {
    SearchResultYoutube,
    SearchResultSound,
    SearchResultUser,
    SearchResultPlaylist
  },
  data () {
    return {
      dialogPlaylist: false,
      sound: {}
    }
  },
  computed: {
    searchResults: {
      get () {
        return this.$store.state.sounds.searchResults
      }
    },
    loading: {
      get () {
        return this.$store.state.sounds.loading
      }
    }
  },
  watch: {
    loading () {
      if (this.loading === true) {
        this.activateLoading()
      } else {
        this.disableLoading()
      }
    }
  },
  async mounted () {
    await this.$store.dispatch('sounds/getItemsByName', {
      name: this.$route.params.name
    })
  },
  methods: {
  }
}
</script>

<style scoped>
.search-bg {
}
</style>
