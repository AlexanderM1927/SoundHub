<template>
  <q-item @click="goTo(menuItem.to)" v-if="menuItem.requireSession === undefined || (menuItem.requireSession && token) || (!menuItem.requireSession && !token)" class="light_font" clickable :active="menuItem.label === 'Outbox'" v-ripple>
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
.light_font {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 18px;
  color: #f5f5f5;
}

</style>
