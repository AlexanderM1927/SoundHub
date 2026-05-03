<template>
  <div class="row popular-body col-11">
    <div class="col-12 popular-cards">
      <!--TITLE CARD-->
      <div class="row title-card q-mr-lg">
        <q-card class="col-12 tc-body">
          <q-card-section class="tc-text">
            Popular<br>
            esta<br>
            semana
          </q-card-section>
        </q-card>
      </div>
      <!--SKELETON LOADERS-->
      <template v-if="loading">
        <div
          v-for="n in 7"
          :key="'skeleton-' + n"
          class="popular-card-skeleton"
        >
          <q-skeleton class="popular-skeleton-img" square />
        </div>
      </template>
      <!--SELECTED SONGS-->
      <template v-else>
        <TopSong
          v-for="song in songs"
          :key="song.id"
          :song="song"/>
      </template>
    </div>
  </div>
</template>

<script>
import TopSong from './TopSong'
import ViewService from '../services/ViewService'
import { functions } from '../functions.js'

export default {
  name: 'BestSongsSection',
  mixins: [functions],
  components: { TopSong },
  data () {
    return {
      songs: [],
      loading: true
    }
  },
  mounted () {
    this.getPopularSounds()
  },
  methods: {
    async getPopularSounds () {
      try {
        this.loading = true
        const request = await ViewService.getViews()
        this.loading = false
        const items = request.data.data.items
        this.songs = items.map(element => {
          let objRes = {}
          if (element.type === 'sound') {
            objRes = {
              sound_id: element.sound_id,
              title: element.sound_name,
              img: element.sound_thumbnail_url,
              type: 'sound'
            }
          } else {
            objRes = {
              id: element.id,
              title: element.title,
              img: element.thumbnail.thumbnails[0].url,
              length: {
                simpleText: element.length?.simpleText ?? ''
              }
            }
          }
          objRes.firstOne = (items.indexOf(element) === 0 ?? false)
          objRes.type = element.type
          return objRes
        })
      } catch (error) {
        this.loading = false
        console.error(error)
      }
    }
  }
}
</script>

<style scoped>
.popular-card-skeleton {
  min-width: 200px;
  width: 15%;
  height: 300px;
  margin: auto 0;
  border-radius: 10px;
  overflow: hidden;
}

.popular-skeleton-img {
  width: 100%;
  height: 300px;
}
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
