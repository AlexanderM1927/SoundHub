<template>
  <!-- NAVBAR ITEM -->
  <q-item
    @click="goTo(menuItem.to)"
    v-if="
      menuItem.requireSession === undefined ||
      (menuItem.requireSession && token) ||
      (!menuItem.requireSession && !token)
    "
    class="NI-container"
    clickable
    :active="menuItem.label === 'Outbox'"
    v-ripple
  >
    <!-- NI-ICON -->
    <q-item-section avatar>
      <q-icon :name="menuItem.icon" />
    </q-item-section>
    <!-- NI-TITLE-->
    <q-item-section>
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
  props: ['menuItem', 'token'],
  mounted () {
  }
}
</script>

<style>
.NI-container {
  margin: 12px;
  /*background-color: rgb(233, 43, 72);*/
  background-color: rgba(47, 47, 51, 0.95);
  font-family: "Inter", sans-serif;
  font-weight: 500;
  font-size: 20px;
  color: #d8d8d8;
  border-radius: 8px;
}
</style>
