<template>
    <div @click="abrirReproductor(result)" style="cursor: pointer;" class="container row search_item justify-around">
        <q-img :src="result.thumbnail.thumbnails[0].url" class="col-3 q-my-sm"></q-img>
        <div class="content q-my-sm col-8" >
            <p class="item_title item_font">{{result.title}}</p>
            <p class="item_font" v-if="result.length.accessibility.accessibilityData">{{result.length.accessibility.accessibilityData.label}}</p>
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

.content {
    color: #E83845;
}

.item_title {
    font-size: 20px;
    font-weight: 500;
    line-height: 20px !important;
}

.item_font {
    color: #f5f5f5;
    font-family: 'Quicksand', sans-serif;
}

</style>
