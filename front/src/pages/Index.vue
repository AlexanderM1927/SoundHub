<template>
  <q-page>
    <div class="row justify-around">
      <!--INITIAL CARD-->
      <div class="row col-11 justify-around">
        <q-card class="col-12 q-mt-md card-body">
          <img src="../assets/lofi-hiphop.jpg">

          <q-card-section>
            <div class="card-title">La mejor música a un par de clicks</div>
          </q-card-section>
          <q-card-section class="q-pt-none card-text">
            Con SoundHub puedes escuchar y descargar tú música favorita, además puedes compartir tus gustos músicales con otros usuarios e intercambiar opiniones. <br> ¿A que estás esperando para compartir tu pasión por la música?
          </q-card-section>
        </q-card>
      </div>
      <!--TOP 10 SONGS OF THE WEEK-->
      <BestSongs/>
      <!--FOOTER-->
      <SoundFooter/>
    </div>
  </q-page>
</template>

<script>
import BestSongs from '../components/BestSongsSection'
import SoundFooter from '../components/Footer.vue'
import { functions } from '../functions.js'

export default {
  name: 'PageIndex',
  mixins: [functions],
  components: {
    BestSongs,
    SoundFooter
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped>
/* INITIAL CARD STYLES */
.card-body {
  background-color: rgba(54, 54, 59, .95);
  border-radius: 8px;
}

.card-title {
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: 2rem;
  color: #f5f5f5;
}

.card-text {
  font-family: 'Inter', sans-serif;
  font-size: 1.2rem;
  color: #c9c9c9;
}
</style>
