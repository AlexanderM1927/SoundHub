<template>
    <div class="player active">
        Hello world
    </div>
</template>
<script setup lang="ts">
</script>

<style>
.player {
  position: fixed;
  bottom: 0px;
  width: 100%;
  height: 70px;
  background: .2a2a2e;
  z-index: 9999;
  transition: all 350ms linear;
}

.player.inactive {
  bottom: -30%;
}

.player.active {
  bottom: -0px;
}
</style>
