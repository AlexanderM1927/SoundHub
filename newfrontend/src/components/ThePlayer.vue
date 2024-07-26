<template>
    <div id="player" class="player inactive bg-gray-800 flex justify-between items-center p-2">
        <div class="rounded-full custom-circular-btn" @click="playPause()">
            <svg v-if="!isPlaying" class="block h-10 w-10 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/>
            </svg>
            <svg v-else class="block h-10 w-10 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z"/>
            </svg>
        </div>
        <div class="player__wave">
            <div id='waveform'></div>
            <audio id="audioBox" controls></audio>
        </div>
        <div class="rounded-full custom-circular-btn">
            <svg class="block h-10 w-10 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path d="M480-680q-33 0-56.5-23.5T400-760q0-33 23.5-56.5T480-840q33 0 56.5 23.5T560-760q0 33-23.5 56.5T480-680Zm-60 560v-480h120v480H420Z"/>
            </svg>
        </div>
    </div>
</template>
<script setup lang="ts">
import WaveSurfer from 'wavesurfer.js'
import { computed, ref, watch, type Ref } from 'vue'
import { useSoundStore } from '../store/sounds'
import { Sound } from "../vite-env"

const wavesurfer: Ref<WaveSurfer | null> = ref(null)
const isPlaying: Ref<boolean> = ref(false)
const soundState = useSoundStore()

const createWaveSurfer = () => {
    wavesurfer.value = WaveSurfer.create({
        container: '#waveform',
        hideScrollbar: true,
        waveColor: '#F5F5F5',
        progressColor: '#CF2741',
        cursorColor: '#fff',
        barWidth: 3,
        backend: 'MediaElement'
    })
    wavesurfer.value.on('error', (err: any) => {
        console.error(err)
    })
    wavesurfer.value.on('loading', (_e: any) => {
    })
    wavesurfer.value.on('ready', () => {
        wavesurfer.value?.playPause()
    })
    wavesurfer.value.on('play', () => {
        isPlaying.value = true
    })
    wavesurfer.value.on('pause', () => {
        isPlaying.value = false
    })
    wavesurfer.value.on('finish', () => {
        // setNewSong('next')
    })
}
const loadFile = (url: string) => {
    const el = document.getElementById('audioBox')
    if (el) el.style.display = 'none'
    if (!wavesurfer.value) createWaveSurfer()
    wavesurfer.value?.load(url)
}



const sound = computed((): Sound => {
    return soundState.state().song
})
// const playlist = computed(() => {
//     return soundState.state.sounds.playlist
// })
// const position = computed(() => {
//     return soundState.state.sounds.position
// })

watch(sound, () => {
    if (sound.value) loadFile(sound.value.url)
})

const playPause = () => {
    if (!isPlaying.value) {
        loadFile('http://localhost:8003/v1/download/video/1vteRJasX1A')
    } else {
        if (wavesurfer.value) wavesurfer.value.playPause()
    }
}


</script>

<style>
.player {
  position: fixed;
  bottom: 0px;
  width: 100%;
  height: 4.5rem;
  z-index: 2;
  transition: all 350ms linear;
}

.player.inactive {
  bottom: -30%;
}

.player.active {
  bottom: 0px;
}

.player__wave {
    width: 60%;
    height: 3rem;
}
</style>
