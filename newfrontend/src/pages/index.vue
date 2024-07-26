<template>
  <section class="custom-container flex justify-center">
    <div class="wrapper">
      <div class="wrapper-card wrapper-card__first box-border bg-white rounded-2xl">
        <h2>Popular<br> Esta<br> Semana</h2>
      </div>
      <div class="wrapper-card box-border bg-white rounded-2xl">
        xDv hoasdasd
      </div>
      <div class="wrapper-card box-border bg-white rounded-2xl">
        xDv hoasdasd
      </div>
    </div>
  </section>
  <section class="custom-container text-white">
    <h3>Escuchadas recientemente</h3>
    <ul class="flex flex-wrap list-none">
      <li class="w-2/5 h-10 bg-gray-800 my-2 mr-8 flex">
        <img class="w-10 h-10" src="../assets/sound.png">
        <div class="w-full overflow-y-auto">
          Dile que tambien la amaste
        </div>
      </li>
      <li class="w-2/5 h-10 bg-gray-800 my-2 mr-8 flex">
        <img class="w-10 h-10" src="../assets/sound.png">
        <div class="w-full overflow-y-auto">
          Dile que tambien la amaste
        </div>
      </li>
      <li class="w-2/5 h-10 bg-gray-800 my-2 mr-8 flex">
        <img class="w-10 h-10" src="../assets/sound.png">
        <div class="w-full overflow-y-auto">
          Dile que tambien la amaste
        </div>
      </li>
      <li class="w-2/5 h-10 bg-gray-800 my-2 mr-8 flex">
        <img class="w-10 h-10" src="../assets/sound.png">
        <div class="w-full overflow-y-auto">
          Dile que tambien la amaste
        </div>
      </li>
      <li class="w-2/5 h-10 bg-gray-800 my-2 mr-8 flex">
        <img class="w-10 h-10" src="../assets/sound.png">
        <div class="w-full overflow-y-auto">
          Dile que tambien la amaste
        </div>
      </li>
      <li class="w-2/5 h-10 bg-gray-800 my-2 mr-8 flex">
        <img class="w-10 h-10" src="../assets/sound.png">
        <div class="w-full overflow-y-auto">
          Dile que tambien la amaste
        </div>
      </li>
    </ul>
  </section>
</template>
<script setup lang="ts">
</script>

<style>
.wrapper {
  display: flex;
  gap: 1.5rem;
  width: 18.75rem;
  height: 18.75rem;
  overflow-x: scroll;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
}

.wrapper-card {
  scroll-snap-align: center;
  padding: 1.5rem 2rem;
  flex-shrink: 0;
  width: 18.75rem;
  height: 18.75rem;
}

.wrapper-card__first {
  background: linear-gradient(130deg,#ff7a18,#af002d 41.07%,#319197 76.05%);
  display: flex;
  justify-content: start;
  text-align: left;
  color: white;
}
</style>