<template>
  <div
    @click="goTo('playlist/' + result.playlist_id + '')"
    style="cursor: pointer"
    class="row col-12 pl-container q-px-sm justify-around"
  >
    <!--TEXT-->
    <div class="col-11 q-my-sm">
      <p class="pl-title">{{ result.playlist_name }}</p>
    </div>
    <!--DELETE ICON-->
    <a class="col-1 pl-delete text-red"> <q-icon name="fas fa-trash-alt"/></a>
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
.pl-container {
  margin: 10px 5px;
  padding: 5px;
  background-color: rgba(54, 54, 59, .9);
  border-radius: 3px;
}

.pl-title {
  margin: auto;
  padding: 4px;
  font-family: "Inter", sans-serif;
  font-size: 1.2rem;
  font-weight: 300;
  color: #f5f5f5;
  line-height: 20px !important;
}

.pl-delete {
  margin: auto auto auto 0;
  font-size: 1.1rem;
  cursor: pointer;
}
</style>
