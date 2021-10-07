<template>
  <q-page>
    <div class="row justify-around">
      <div :class="`custom-dark-bg col-xs-12`">
        <p class="title text-h6 q-ml-md q-mt-md">Mis Favoritos <a v-if="token" class="text-green" style="cursor: pointer;" @click="agregarPlaylist()"> </a></p>
        <div class="q-mx-sm q-my-md" v-if="token">
          <FavoriteItem/>
          <FavoriteItem/>
          <FavoriteItem/>
        </div>
        <div class="q-mx-md" v-else>
          <p class="default-msg">Para marcar favoritos, primero debes iniciar sesión.</p>
          <q-btn class="yellow-btn" label="Ingresar" to="/login" color="orange"/>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import FavoriteItem from '../components/FavoriteItem.vue'
import { functions } from '../functions.js'

export default {
  name: 'Favoritos',
  mixins: [functions],
  components: { FavoriteItem },
  data () {
    return {
      token: localStorage.getItem('token')
    }
  }
}
</script>
