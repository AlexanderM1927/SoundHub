<template>
  <q-layout view='hHh Lpr lFf' class="ov-h">
    <Navbar />

    <q-page-container style="margin-bottom: 5rem;">
      <router-view />
    </q-page-container>
    <Player />
  </q-layout>
</template>

<script>
import Navbar from 'components/Navbar.vue'
import Player from 'components/Player.vue'
import { functions } from '../functions.js'

export default {
  name: 'MainLayout',
  components: { Navbar, Player },
  mixins: [functions],
  data () {
    return {
      leftDrawerOpen: false,
      isLoading: false
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.ov-h{
  overflow: hidden !important;
}
</style>
