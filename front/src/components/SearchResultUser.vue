<template>
  <div class="q-mb-sm">
    <!--VIDEO CONTENT-->
    <div
      :class="'row justify-around'"
      @click="goTo('/profile/' + result.user_id)"
    >
      <div :class="'rslt_div_title col-12'">
        <p :class="'rslt_title'"><q-icon name="fas fa-user"/> {{ result.user_name }}</p>
      </div>
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
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.rslt_div_title{
  background-color: #36363b;
  padding: 0.4rem 0.4rem 0px 0.4rem;
}

.rslt_title {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 1.05rem;
  color: #f5f5f5;
  line-height: 1.25rem !important;
}
</style>
