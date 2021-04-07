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
    }
  },
  methods: {
  }
}
</script>
