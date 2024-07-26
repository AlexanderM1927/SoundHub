<template>
  <div class="row text-white">
    <div class="col-12">
      <h5 style="padding-left: 1rem;">Escuchado recientemente</h5>
      <div class="row">
        <div class="col-6" v-for="result in songs" v-bind:key="result.id">
          <SearchResultYoutube v-if="result.type === 'video'" :result="result" :download="true" :tiny="false" />
          <SearchResultSound v-else-if="result.type === 'sound'" :result="result" :download="true" :tiny="false" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { functions } from '../functions.js'
import SearchResultSound from './SearchResultSound.vue'
import SearchResultYoutube from './SearchResultYoutube.vue'

export default {
  name: 'RecentSongsSection',
  mixins: [functions],
  components: {
    SearchResultSound,
    SearchResultYoutube
  },
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
      const recentPlayed = await this.getDataCollection('recent')
      const soundsSorted = recentPlayed.sort((a, b) => {
        if (a.time > b.time) {
          return -1
        }
        if (a.time < b.time) {
          return 1
        }

        return 0
      })
      this.songs = [
        ...this.removeDuplicates(soundsSorted).slice(0, 6)
      ]
    },
    removeDuplicates (arr) {
      return arr.filter((item, index) => {
        const elIndex = arr.findIndex(function (el) {
          return el.id === item.id
        })
        return elIndex === index
      })
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
