<template>
  <div class="row pl-container">
    <div
      @click="goTo('playlist/' + result.playlist_id + '')"
      style="cursor: pointer"
      class="row col-11 justify-around"
    >
      <!--TEXT-->
      <div class="col-12 q-my-sm">
        <p class="pl-title">{{ result.playlist_name }}</p>
      </div>
    </div>
    <!--DELETE ICON-->
    <div v-if="tiny===false" class="margin-auto">
      <a class="col-1 pl-delete text-red"><q-icon name="fas fa-trash-alt"/></a>
    </div>
  </div>
</template>

<script>
import { functions } from '../functions.js'

export default {
  name: 'PlaylistResult',
  mixins: [functions],
  props: ['result', 'tiny'],
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

.margin-auto {
  margin: auto;
}

.pl-delete {
  font-size: 1.1rem;
  cursor: pointer;
}
</style>
