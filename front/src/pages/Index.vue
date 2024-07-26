<template>
  <q-page>
    <div class="row justify-around">
      <!--TOP 10 SONGS OF THE WEEK-->
      <BestSongs/>
      <RecentSongs/>
    </div>
  </q-page>
</template>

<script>
import RecentSongs from '../components/RecentSongsSection'
import BestSongs from '../components/BestSongsSection'
import { functions } from '../functions.js'

export default {
  name: 'PageIndex',
  mixins: [functions],
  components: {
    BestSongs,
    RecentSongs
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
