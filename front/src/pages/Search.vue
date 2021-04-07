<template>
    <div class="row justify-around search_body">
        <div class="col-md-8 col-xs-12 search_result">
            <p class="search_title q-ml-md q-mt-md">RESULTADOS DE LA BÚSQUEDA</p>
            <div v-bind:key="result.id" v-for="result in searchResults">
              <Search :result="result" />
              <q-separator></q-separator>
            </div>
        </div>
    </div>
</template>

<script>
import { functions } from '../functions.js'
import Search from '../components/SearchResult.vue'

export default {
  mixins: [functions],
  components: { Search },
  data () {
    return {
    }
  },
  computed: {
    searchResults: {
      get () {
        return this.$store.state.videos.searchResults
      }
    },
    loading: {
      get () {
        return this.$store.state.videos.loading
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
    await this.$store.dispatch('videos/getItemsByName', {
      name: this.$route.params.name
    })
  },
  methods: {

  }
}
</script>

<style>
.search_body {
    width: 100%;
    height: 100%;
    background-attachment: fixed;
    background-image: url('../assets/login-background.jpg');
    background-position: center center;
}

.search_title {
    font-size: 20px;
    color: #c5c5c5;
}

.search_result {
    height: 100vh;
    background-color: #36363b;
}
</style>
