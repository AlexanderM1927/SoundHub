<template>
  <div class="row text-white">
    <div class="col-12">
      <!-- <h5>Escuchado recientemente</h5> -->
      <div class="row">
        <div class="col-md-6"></div>
        <div class="col-md-6"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { functions } from '../functions.js'

export default {
  name: 'RecentSongsSection',
  mixins: [functions],
  data () {
    return {
      songs: []
    }
  },
  mounted () {
    this.getRecentSongs()
  },
  methods: {
    async getRecentSongs () {

    }
  }
}
</script>

<style scoped>
/* MOST POPULAR SONGS */
.popular-body {
  margin-top: 2rem;

  overflow-x: scroll !important;
  white-space: nowrap;
}

.popular-cards {
  display: flex;
  overflow-x: auto;
  border-radius: 10px;
}

.popular-body::-webkit-scrollbar {
  visibility: hidden;
}

/* RELATED TO SCROLLBAR */
.popular-cards::-webkit-scrollbar {
  height: 10px;
}

.popular-cards::-webkit-scrollbar-track {
  background: rgba(20, 20, 20, 0.75);
  border-radius: 10px;
}

.popular-cards::-webkit-scrollbar-thumb {
  background: rgba(15, 15, 15, 0.45);
  border-radius: 10px;
}

/* TITLE CARD */
.title-card {
  height: 340px;
  padding: 8px;
  background: linear-gradient(130deg,#ff7a18,#af002d 41.07%,#319197 76.05%);
  border-radius: 8px;
}

.tc-body {
  min-width: 180px;
  width: 15%;
  background-color: black;
  border-radius: 5px;
}

.tc-text {
  font-family: 'Inter', sans-serif;
  font-weight: 900;
  font-size: 2.1rem;
  color: #ffffff;
  line-height: 2.3rem;
}
</style>
