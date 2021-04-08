<template>
  <q-item @click="goLocation(menuItem.to)" v-if="menuItem.isLogin === undefined || (menuItem.isLogin && token) || (!menuItem.isLogin && !token)" class="light_font" clickable :active="menuItem.label === 'Outbox'" v-ripple>
    <q-item-section avatar>
      <q-icon :name="menuItem.icon"/>
    </q-item-section>
    <q-item-section >
      {{ menuItem.title }}
    </q-item-section>
  </q-item>
</template>

<script>
import { functions } from '../functions.js'
export default {
  mixins: [functions],
  data () {
    return {
    }
  },
  name: 'NavLink',
  props: ['menuItem', 'token']
}
</script>

<style>

</style>
