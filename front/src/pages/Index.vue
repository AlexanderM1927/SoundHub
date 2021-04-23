<template>
  <q-page>
    <div class="row justify-around">
      <!--CARD-->
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
    </div>
  </q-page>
</template>

<script>
import BestSongs from '../components/BestSongsSection'
export default {
  name: 'PageIndex',
  components: { BestSongs },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped>
/* INITIAL CARD */
.card-body {
  background-color: #36363b;
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
