<template>
  <div class="row">
    <!--PROFILE HEAD-->
    <div class="row prfl-img-div col-12">
      <!--PROFILE IMAGE-->
      <div class="prfl-img">
        <label for="prfl-filepicker">
          <img class="prfl-img" src="../assets/default-user-img.png"/>
        </label>

        <input id="prfl-filepicker" type="file" />
      </div>
    </div>

    <!--PROFILE DATA-->
    <q-form class="row prfl-form justify-around full-width" action="submit" @submit="save">
      <!--BASIC INFORMATION-->
      <q-input class="prfl-input col-11" v-model="user.user_name" label="Nombre" dark borderless :disable="true"></q-input>
      <q-input class="prfl-input col-11" v-model="user.user_country" label="País" dark borderless :disable="true"></q-input>
    </q-form>
    <div class="row justify-around full-width">
      <div class="col-11">
        <p class="title text-h6 q-ml-md">Listas de {{user.user_name}}</p>
        <div class="q-mx-xs" v-bind:key="result.id" v-for="result in playlists">
          <PlaylistResult :result="result"/>
        </div>
      </div>
    </div>
    <q-page-sticky position="top-right" :offset="[18, 18]" v-if="userLogin && user.user_id !== userLogin.user_id">
      <q-btn @click="modalChat = !modalChat" fab icon="message" color="pink" />
    </q-page-sticky>
    <q-dialog
      v-model="modalChat"
      transition-show="slide-up"
      transition-hide="slide-down"
      :maximized="true"
    >
      <q-card class="pl-card-body">
        <q-bar>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
        <div class="content">
          <ChatBox :userTo="user"></ChatBox>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import UserService from '../services/UserService'
import PlaylistService from '../services/PlaylistService'
import { functions } from '../functions.js'
import PlaylistResult from '../components/PlaylistResult.vue'
import ChatBox from '../components/ChatBox.vue'

export default {
  mixins: [functions],
  name: 'profile',
  components: { PlaylistResult, ChatBox },
  data () {
    return {
      img: '../assets/default-user-img.png',
      profile: null,
      userLogin: JSON.parse(localStorage.getItem('user')),
      playlists: [],
      user: {},
      modalChat: false
    }
  },
  mounted () {
    this.getProfileInfo()
    this.getPlaylists()
  },
  methods: {
    async getProfileInfo () {
      try {
        this.activateLoading()
        const request = await UserService.getUser({
          id: this.$route.params.id
        })
        this.user = request.data.data
        this.disableLoading()
      } catch (error) {
        console.error(error)
      }
    },
    async getPlaylists () {
      this.activateLoading()
      try {
        const params = {
          user_id: this.$route.params.id
        }
        const request = await PlaylistService.getPlaylists(params)
        this.playlists = request.data.data
      } catch (error) {
        console.log(error)
      }
      this.disableLoading()
    },
    reset () {
      this.getProfileInfo()
    },
    async save () {
      this.activateLoading()
      try {
        const params = {
          id: this.userLogin.user_id,
          user_name: this.user.user_name,
          user_country: this.user.user_country,
          user_email: this.user.user_email
        }
        const request = await UserService.modifyUser(params)
        if (request.status === 200) this.alert('positive', 'Perfil actualizado')
      } catch (error) {
        console.log(error)
      }
      this.disableLoading()
    }
  }
}
</script>

<style>
/* FAVORITE ICON */
.prfl-favorite-btn {
  position: absolute;
  display: flex;
  justify-content: center;

  left: 5vw;
  height: 60px;
  width: 60px;
  border-radius: 50%;

  font-size: 38px;
}

.prfl-fv-i-active {
  color: #d1234f;
  transition: 0.35s;
}

.prfl-fv-i-inactive {
  color: #ffe9ef;
  transition: 0.35s;
}

/* IMAGE STYLES */
.prfl-img-div {
  height: 8rem !important;
  background-color: rgba(54, 54, 59, .95);
}

.prfl-img {
  max-width: 300px;
  min-width: 170px;
  width: 40%;
  margin: auto auto -40px auto;
  border-radius: 50%;
}

.prfl-img>input {
  display: none;
}

/* FORM STYLES */
.prfl-form {
  margin: 6rem 1rem 2.5rem 1rem;
}

.prfl-input {
  margin-bottom: 1rem;
  padding: 0 10px;
  background-color: rgba(54, 54, 59, .92);
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  border-radius: 10px;
}
</style>
