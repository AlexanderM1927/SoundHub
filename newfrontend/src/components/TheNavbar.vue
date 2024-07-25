<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  // open
  const burger = document.querySelectorAll('.navbar-burger')
  const menu = document.querySelectorAll('.navbar-menu')

    if (burger.length && menu.length) {
      for (let i = 0; i < burger.length; i++) {
        burger[i].addEventListener('click', function() {
          for (let j = 0; j < menu.length; j++) {
            menu[j].classList.toggle('hidden');
          }
        });
      }
    }

    // close
    const close = document.querySelectorAll('.navbar-close');
    const backdrop = document.querySelectorAll('.navbar-backdrop');

    if (close.length) {
      for (let i = 0; i < close.length; i++) {
        close[i].addEventListener('click', function() {
          for (let j = 0; j < menu.length; j++) {
            menu[j].classList.toggle('hidden');
          }
        });
      }
    }

    if (backdrop.length) {
      for (let i = 0; i < backdrop.length; i++) {
        backdrop[i].addEventListener('click', function() {
          for (let j = 0; j < menu.length; j++) {
            menu[j].classList.toggle('hidden');
          }
        });
      }
    }
})
</script>

<template>
  <nav class="fixed w-full top-0 px-4 py-2 flex justify-between items-center bg-gray-900">
		<a class="text-3xl font-bold text-white leading-none flex items-center" href="/">
			<img src="../assets/favicon.png" class="nav-icon" />
			SoundHub
		</a>
		<div>
      <div class="flex">
        <button class="flex items-center text-red-600 p-3">
			<svg xmlns="http://www.w3.org/2000/svg" class="block h-5 w-5 fill-current" viewBox="0 -960 960 960">
				<path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
			</svg>
        </button>
        <button class="navbar-burger flex items-center text-red-600 p-3">
          <svg class="block h-4 w-4 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <title>Mobile menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
          </svg>
        </button>
      </div>
		</div>
	</nav>
	<div class="navbar-menu relative z-50 hidden">
		<div class="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25"></div>
		<nav class="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto">
			Hi
		</nav>
	</div>
</template>

<style scoped>
.nav-icon {
  width: 2.5rem;
  height: 2.5rem;
  margin: auto;
  font-weight: 300;
  font-size: 24px;
}
</style>