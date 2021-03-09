<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <login-component v-if="view === 'login'"></login-component>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import LoginComponent from '../components/Login/LoginComponent'

export default {
  name: 'MainLayout',
  components: { LoginComponent },
  data () {
    return {
    }
  },
  props: ['view']
}
</script>
