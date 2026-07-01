<template>
  <q-card class="popular-card" @click="openPlayer(song)">
    <q-img :src="getThumbnailUrl(song)" class="p-card-img" basic>
      <div v-if="song.firstOne" style="background-color: transparent">
        <q-icon name="fas fa-crown" class="crown"></q-icon>
      </div>
      <q-card-section class="p-card-text">
        <p class="p-card-p">{{ song.display_title || song.title || 'Sin titulo' }}</p>
      </q-card-section>
    </q-img>
  </q-card>
</template>

<script>
import { functions } from '../functions.js'

export default {
  name: 'TopSong',
  mixins: [functions],
  props: ['song'],
  data () {
    return {}
  }
}
</script>

<style scoped>
.popular-card {
  min-width: 200px;
  width: 15%;
  height: 300px;
  margin: auto 0;
  background: none;
  border-radius: 10px;
  box-shadow: -20px 0 3rem 0.1rem #000;
  transition: 0.5s;
  cursor: pointer;
  overflow: hidden;
}

.p-card-img {
  height: 300px;
  position: relative;
}

.p-card-text {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.65);
  color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.25s ease;
  pointer-events: none;
}

.p-card-p {
  width: 95%;
  margin: 0;
  font-size: 1rem;
  text-align: center;
  white-space: pre-wrap;
}

.crown {
  position: absolute;
  top: 0.7rem;
  left: 0.7rem;
  font-size: 1.5rem;
  color: rgb(255, 217, 0);
}

.popular-card:hover {
  transform: scale(1.1);
  transition: 0.5s;
  z-index: 5;
}

.popular-card:hover .p-card-text {
  opacity: 1;
}
</style>
