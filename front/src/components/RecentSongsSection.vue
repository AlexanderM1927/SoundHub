<template>
  <div class="recent-section text-white" v-if="loading || songs.length > 0">
    <div class="recent-title">
      <q-icon name="history" class="recent-title__icon" />
      <span>Escuchado recientemente</span>
    </div>
    <div class="recent-scroll">
      <!--SKELETON LOADERS-->
      <template v-if="loading">
        <div v-for="n in 8" :key="'skeleton-' + n" class="recent-card">
          <q-skeleton class="recent-skeleton-img" square />
          <q-skeleton type="text" class="q-mt-sm" />
          <q-skeleton type="text" width="50%" />
        </div>
      </template>
      <!--RECENT SONGS-->
      <template v-else>
        <div
          class="recent-card"
          v-for="result in songs"
          :key="result.id || result.sound_id"
          @click="openPlayer(result)"
        >
          <div class="recent-card__img-wrap">
            <img
              v-if="result.type === 'video'"
              :src="getThumbnailUrl(result)"
              class="recent-card__img"
            />
            <img
              v-else
              :src="getThumbnailUrl(result)"
              class="recent-card__img"
            />
            <div class="recent-card__overlay">
              <q-icon name="play_arrow" class="recent-card__play-icon" />
            </div>
          </div>
          <p class="recent-card__title">
            {{ result.title || result.sound_name }}
          </p>
          <p v-if="result.length" class="recent-card__duration">
            {{ result.length.simpleText }}
          </p>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { functions } from '../functions.js'

export default {
  name: 'RecentSongsSection',
  mixins: [functions],
  components: {},
  data () {
    return {
      songs: [],
      loading: true
    }
  },
  computed: {
    song: {
      get () {
        return this.$store.state.sounds.song
      }
    }
  },
  watch: {
    song () {
      setTimeout(() => {
        this.getRecentSongs()
      }, 1500)
    }
  },
  mounted () {
    this.getRecentSongs()
  },
  methods: {
    async getRecentSongs () {
      this.loading = true
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
        ...this.removeDuplicates(soundsSorted).slice(0, 10)
      ]
      this.loading = false
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
.recent-section {
  width: 100%;
  padding: 1.5rem 2rem;
}

.recent-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: 1.5rem;
  margin-bottom: 1.25rem;
  color: #ffffff;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.recent-title__icon {
  font-size: 1.4rem;
  color: #e04060;
}

.recent-scroll {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.75rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.2) transparent;
}

.recent-scroll::-webkit-scrollbar {
  height: 5px;
}

.recent-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.recent-scroll::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.2);
  border-radius: 10px;
}

.recent-skeleton-img {
  width: 150px;
  height: 150px;
  border-radius: 10px;
}

.recent-card {
  flex: 0 0 auto;
  width: 150px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.recent-card:hover {
  transform: translateY(-4px);
}

.recent-card__img-wrap {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 10px;
  overflow: hidden;
}

.recent-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.recent-card__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.recent-card:hover .recent-card__overlay {
  opacity: 1;
}

.recent-card__play-icon {
  font-size: 3rem;
  color: #fff;
}

.recent-card__title {
  margin: 0.5rem 0 0.1rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #f0f0f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recent-card__duration {
  margin: 0;
  font-size: 0.75rem;
  color: #aaa;
}
</style>
