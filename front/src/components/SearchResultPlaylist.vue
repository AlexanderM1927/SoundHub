<template>
  <div class="q-mb-sm">
    <div class="search-result search-result__user" @click="goTo('/playlist/' + result.playlist_id)">
      <svg class="search-result__image" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#5f6368">
        <path d="M640-160q-50 0-85-35t-35-85q0-50 35-85t85-35q11 0 21 1.5t19 6.5v-328h200v80H760v360q0 50-35 85t-85 35ZM120-320v-80h320v80H120Zm0-160v-80h480v80H120Zm0-160v-80h480v80H120Z"/>
      </svg>
      <div>
        <div>
          <p style="
            text-decoration: none;
            color: #DEA559;
            font-weight: bold;
            cursor: pointer;
          ">
            {{ result.playlist_name }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { functions } from '../functions.js'

export default {
  mixins: [functions],
  name: 'SearchResult',
  props: ['result'],
  data () {
    return {
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
