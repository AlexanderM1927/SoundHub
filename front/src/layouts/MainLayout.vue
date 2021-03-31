<template>
  <q-layout view="hHh Lpr lFf">
    <Navbar />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import Navbar from 'components/Navbar.vue'

export default {
  name: 'MainLayout',
  components: { Navbar },
  data () {
    return {
      leftDrawerOpen: false
    }
  },
  props: ['view']
}
</script>
