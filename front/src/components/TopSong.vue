<template>
  <q-card class="popular-card" @click="openPlayer(song)">
    <q-img :src="song.type === 'video' ? song.img : this.getSrcFromBackend(song.img)" class="p-card-img" basic>
      <div v-if="song.firstOne" style="background-color: transparent">
        <q-icon name="fas fa-crown" class="crown"></q-icon>
      </div>
      <q-card-section class="p-card-text">
        <p class="p-card-p">{{ song.title }}</p>
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
}

.p-card-img {
  height: 300px;
}

.p-card-text {
  width: 100%;
  height: 300px;

  background-color: rgba(0, 0, 0, 0.65);
  color: #f5f5f5;

  opacity: 0;
  transition: visibility 0.3s linear, opacity 0.3s linear;
}

.p-card-p {
  width: 95%;
  margin: 0;

  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);

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

/* EFFECTS */
.popular-card:hover {
  transform: scale(1.1);
  transition: 0.5s;
  z-index: 5;
}

.popular-card:hover .p-card-text {
  visibility: visible;
  opacity: 1;
}
</style>
