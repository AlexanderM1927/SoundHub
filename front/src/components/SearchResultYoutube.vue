<template>
  <div>
    <div class="search-result" @click="abrirReproductor(result)">
      <img v-if="result.img" :src="result.img" class="search-result__image">
      <img v-else :src="result.thumbnail.thumbnails[0].url" class="search-result__image">
      <div>
        <div><b>{{ result.title }}</b></div>
      </div>
    </div>
  </div>
</template>

<script>
import { functions } from '../functions.js'

export default {
  mixins: [functions],
  name: 'SearchResult',
  props: ['result', 'download', 'tiny', 'playlist'],
  data () {
    return {
      token: localStorage.getItem('token')
    }
  },
  methods: {
  }
}
</script>

<style>
/*BIG VERSION STYLES */
.rslt_div_title{
  background-color: #36363b;
  padding: 0.4rem 0.4rem 0px 0.4rem;
}

.rslt_title {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 1.05rem;
  color: #f5f5f5;
  line-height: 1.25rem !important;
}

.rlst-img {
  height: 100px !important;
  margin: auto;
}

.rslt-img-text {
  position: absolute;
  padding: 2px;
  bottom: -18px;
  background-color: rgba(0, 0, 0, 0.75);

  text-align: center;
  color: #ffffff;
}

.rslt-div-btns {
  background-color: #36363b;
  padding-bottom: 10px;
}

/*TINY VERSION STYLES*/
.pli-img {
  height: 80px !important;
}

.pli-text {
  padding: 0 7% 0 8px;
  font-family: 'Inter', sans-serif;
  font-size: .9rem;
  color: white;
}

.zero {
  width: 0;
  height: 0;
}

.pli-delete {
  position: relative;
  top: -109px;
  left: 99vw;
  margin-left: -2rem;
  width: 1.5rem;
  height: 1.8rem;
  font-size: 1.4rem;
  background-color: #FF9800;
  cursor: pointer;
  z-index: 5;
}

/*PLAYLIST CARD STYLES*/
.pl-card-body {
  background-color: #36363b;
  max-width: 90vw;
  width: 800px;
  overflow: hidden !important;
}
</style>
