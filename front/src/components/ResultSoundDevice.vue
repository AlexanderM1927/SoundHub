<template>
  <div class="q-mb-sm">
    <div class="row rsd-div search_item" @click="abrirReproductor(result)">
      <q-img class="rsd-img col-3" src="~assets/sound.png"></q-img>
      <div class="col-8" >
        <p class="rsd-text">{{result.sound_name}}</p>
      </div>
    </div>
    <!--REMOVE BUTTON-->
    <div class="zero">
      <a class="rsd-delete text-black"> <q-icon name="fas fa-times"/></a>
    </div>
  </div>
</template>

<script>
import { functions } from '../functions.js'

export default {
  mixins: [functions],
  name: 'SearchResult',
  props: ['result'],
  data () {
    return {
    }
  }
}
</script>

<style>
.rsd-div {
  margin: 0.5rem;
  background-color: rgba(54, 54, 59, 0.9);
  border-radius: 3px;
}

.rsd-img {
  height: 90px !important;
  margin: 0.5rem;
}

.rsd-text {
  padding: 0.5rem 7% 0 0px;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: .93rem;
  color: whitesmoke;
  line-height: 1.25rem !important;
}

.zero {
  width: 0;
  height: 0;
}

.rsd-delete {
  position: relative;
  top: -112px;
  left: 99vw;
  margin-left: -2rem;
  width: 1.5rem;
  height: 1.8rem;
  font-size: 1.4rem;
  background-color: #FF9800;
  cursor: pointer;
  z-index: 5;
}

</style>
