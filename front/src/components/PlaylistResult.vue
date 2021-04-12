<template>
    <div @click="goTo('playlist/' + result.playlist_id + '')" style="cursor: pointer;" class="container row search_item justify-around">
      <div class="content q-my-sm col-12" >
          <p class="item_title item_font">{{result.playlist_name}}</p>
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
  padding: 10px;
}

.item_title {
    font-size: 20px;
    font-weight: 500;
    line-height: 20px !important;
}

.item_font {
    color: #f5f5f5;
    font-family: 'Quicksand', sans-serif;
}

</style>
