<template>
    <div class="row justify-around">
        <div class="col-md-8 col-xs-12 container">
            <p class="title text-h6 q-ml-md q-mt-md">RESULTADOS DE LA BÚSQUEDA</p>
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
