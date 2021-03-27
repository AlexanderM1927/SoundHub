<template>
  <ion-page>
    <login v-if="view === 'login'" />
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import Login from '../pages/Login'

export default defineComponent({
  name: 'Home',
  props: ['view'],
  components: {
    Login
  }
});
</script>