<template>
  <div
    @click="goTo('playlist/' + result.playlist_id + '')"
    style="cursor: pointer"
    class="row col-12 container q-px-sm justify-around"
  >
    <div class="content q-my-sm col-12 items-center">
      <p class="item_text">{{ result.playlist_name }}</p>
    </div>
  </div>
</template>

<script>
import { functions } from '../functions.js'

export default {
  mixins: [functions],
  name: 'Playlist',
  props: ['result'],
  data () {
    return {
    }
  }
}
</script>

<style>
.content {
  background-color: #44444b;
  padding: 10px;
}

.item_text {
  margin: auto;
  padding: 5px;
  font-family: sans-serif;
  font-size: 20px;
  font-weight: 500;
  color: #f5f5f5;
  line-height: 20px !important;
}
</style>
