<template>
  <q-page>
    Hola<br>
    {{searchResults}}
  </q-page>
</template>

<script>
import { functions } from '../functions.js'

export default {
  name: 'PageIndex',
  mixins: [functions],
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
  methods: {
  }
}
</script>
