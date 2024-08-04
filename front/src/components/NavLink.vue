<template>
  <!-- NAVBAR ITEM -->
  <q-item
    @click="execute(menuItem)"
    v-if="
      menuItem.requireSession === undefined ||
      (menuItem.requireSession && user) ||
      (!menuItem.requireSession && !user)
    "
    :class="'NI-container ' + (menuItem.active ? 'bg-pink' : '')"
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
<!-- goTo(menuItem.to) -->
<script>
import { functions } from '../functions.js'
export default {
  mixins: [functions],
  data () {
    return {
    }
  },
  name: 'NavLink',
  props: ['menuItem', 'user'],
  mounted () {
  },
  methods: {
    execute (menuItem) {
      if (menuItem.hasAction) {
        this[menuItem.action]()
      } else {
        this.goTo(menuItem.to)
      }
    },
    updateApp () {
      if (window.caches) {
        window.caches.keys().then((keyList) => Promise.all(keyList.map((key) => caches.delete(key))))
        window.location.reload()
      }
    }
  }
}
</script>

<style>
.NI-container {
  margin: 12px;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  font-size: 20px;
  color: #d8d8d8;
  border-radius: 8px;
}
</style>
