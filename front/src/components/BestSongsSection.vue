<template>
  <div class="row popular-body col-11">
    <div class="col-12 popular-cards">
      <!--TITLE CARD-->
      <div class="row title-card q-mr-lg">
        <q-card class="col-12 tc-body">
          <q-card-section class="tc-text">
            Popular<br>
            esta<br>
            semana
          </q-card-section>
        </q-card>
      </div>
      <!--SELECTED SONGS-->
      <TopSong
       v-for="song in songs"
       :key="song.title"
       v-bind="song"/>
    </div>
  </div>
</template>

<script>
import TopSong from './TopSong'

export default {
  name: 'BestSongsSection',
  components: { TopSong },
  data () {
    return {
      songs: [
        {
          title: 'Yoasobi - Yure Ni Kakeru',
          img: 'popular-song-1.jpg',
          firstOne: true
        },
        {
          title: 'Luis Fonsi - Despacito ft. Daddy Yankee',
          img: 'popular-song-2.png'
        },
        {
          title: 'Hollow Knight - Enter Hallownest',
          img: 'popular-song-3.png'
        },
        {
          title: 'Bloodborne Soundtrack OST - Lady Maria (The Old Hunters)',
          img: 'popular-song-4.jpeg'
        },
        {
          title: 'Don Omar - El señor de la noche',
          img: 'popular-song-5.jpg'
        },
        {
          title: 'Rell, la Doncella de Hierro | Tema de campeona (ft. Ecca Vandal) - League of Legends',
          img: 'popular-song-6.jpg'
        },
        {
          title: 'Transistor Original Sountrack - The Spine',
          img: 'popular-song-7.jpg'
        },
        {
          title: 'Black Coast - TRNDSTTR (Lucian Remix)',
          img: 'popular-song-8.jpg'
        },
        {
          title: 'Cécile Corbel - Le bal des chats',
          img: 'popular-song-9.jpg'
        },
        {
          title: 'Bruno Mars - Locked out of Heaven (Official Music Video)',
          img: 'popular-song-10.jpg'
        }
      ]
    }
  }
}
</script>

<style scoped>
/* MOST POPULAR SONGS */
.popular-body {
  margin-top: 2rem;

  overflow-x: scroll !important;
  white-space: nowrap;
}

.popular-cards {
  display: flex;
  overflow-x: auto;
  border-radius: 10px;
}

.popular-body::-webkit-scrollbar {
  visibility: hidden;
}

/* RELATED TO SCROLLBAR */
.popular-cards::-webkit-scrollbar {
  height: 10px;
}

.popular-cards::-webkit-scrollbar-track {
  background: rgba(20, 20, 20, 0.75);
  border-radius: 10px;
}

.popular-cards::-webkit-scrollbar-thumb {
  background: rgba(15, 15, 15, 0.45);
  border-radius: 10px;
}

/* TITLE CARD */
.title-card {
  height: 340px;
  padding: 8px;
  background: linear-gradient(130deg,#ff7a18,#af002d 41.07%,#319197 76.05%);
  border-radius: 8px;
}

.tc-body {
  min-width: 180px;
  width: 15%;
  background-color: black;
  border-radius: 5px;
}

.tc-text {
  font-family: 'Inter', sans-serif;
  font-weight: 900;
  font-size: 2.1rem;
  color: #ffffff;
  line-height: 2.3rem;
}
</style>
