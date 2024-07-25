<script setup lang="ts">
import TheNavbar from './components/TheNavbar.vue'
import ThePlayer from './components/ThePlayer.vue'
</script>

<template>
  <TheNavbar/>
  <div class="mt-12">
    <div class="p-4">
      <RouterView></RouterView>
    </div>
  </div>
  <ThePlayer/>
</template>

<style scoped>

</style>
