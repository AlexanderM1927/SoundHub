<template>
  <!-- NAVBAR COMPONENT -->
  <div>
    <!-- HEADER ICON/NAME-->
    <q-header elevated class="bg-grey">
      <q-toolbar class="row nav-height col-12 justify-between">
        <div class="row" @click="goTo('/')">
          <img src="/favicon.png" class="nav-icon" />
          <q-toolbar-title class="nav-title vertical-middle">
            SoundHub
          </q-toolbar-title>
        </div>
        <q-btn
          class="nav-burger"
          flat
          @click="side_options = !side_options"
          round
          dense
          icon="fas fa-bars"
        />
      </q-toolbar>
    </q-header>
    <!-- SIDE DRAWER -->
    <q-drawer
      v-model="side_options"
      show-if-above
      :width="300"
      :breakpoint="2000"
      bordered
      content-class="bg-grey"
    >
      <q-scroll-area class="fit">
        <q-list>
          <!-- SEARCH BAR -->
          <q-item>
            <q-input
              dark
              dense
              borderless
              @keyup.enter="search()"
              v-model="search_content"
              class="nav-input full-width q-pa-xs q-pl-sm"
              placeholder="Buscar..."
            >
              <template v-slot:prepend>
                <q-icon v-if="search_content === ''" name="fas fa-search" />
                <q-icon
                  v-else
                  name="fas fa-times"
                  class="cursor-pointer"
                  @click="search_content = ''"
                />
              </template>
            </q-input>
          </q-item>
          <!-- ITEMS -->
          <template v-for="(menuItem, index) in menuList">
            <NavLink :menuItem="menuItem" :token="token" :key="index" />
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>
  </div>
</template>

<script>
import { functions } from '../functions.js'
import NavLink from './NavLink'
import { io } from 'socket.io-client'

const menuList = [
  {
    title: 'Mi perfil',
    icon: 'far fa-user-circle',
    to: '/profile',
    separator: true,
    requireSession: true
  },
  {
    title: 'Mis listas',
    icon: 'fas fa-play',
    to: '/playlist',
    separator: false,
    requireSession: true
  },
  {
    title: 'Mis canciones',
    icon: 'fas fa-music',
    to: '/sound',
    separator: false
  },
  {
    title: 'Login',
    icon: 'far fa-sign-in',
    to: '/login',
    separator: true,
    requireSession: false
  },
  {
    title: 'Salir',
    icon: 'fas fa-sign-out-alt',
    to: '/logout',
    separator: false,
    requireSession: true
  }
]
export default {
  name: 'Navbar',
  components: { NavLink },
  mixins: [functions],
  data () {
    return {
      search_content: '',
      side_options: false,
      menuList,
      token: localStorage.getItem('token'),
      user: JSON.parse(localStorage.getItem('user'))
    }
  },
  computed: {
    searchText: {
      get () {
        return this.$store.state.sounds.searchText
      }
    },
    notifications: {
      get () {
        return this.$store.state.chat.notifications
      }
    }
  },
  watch: {
    searchText () {
      this.search_content = this.searchText
    },
    notifications () {
      this.menuList = this.menuList.map((menu) => {
        if (menu.to === '/chat') {
          menu.active = this.notifications.length > 0
        }
        return menu
      })
    }
  },
  mounted () {
    this.getChats()
    this.menuList.push({
      title: 'Chats',
      icon: 'fas fa-bells',
      to: '/chat',
      separator: false,
      requireSession: true,
      active: (this.notifications.length > 0)
    })
  },
  methods: {
    delete_search () {
      this.search_content = ''
    },
    search () {
      this.side_options = false
      this.$store.dispatch('sounds/getItemsByName', {
        name: this.search_content
      })
      this.goTo('/search/' + this.search_content)
      // location.href = '/search/' + this.search_content
    },
    getChats () {
      const server = process.env.API_URL.replace('/v1/', '')
      this.socket = io(server)
      this.socket.on('message', message => {
        if (message.userTo.user_id === this.user.user_id) {
          this.$store.dispatch('chat/addChats', {
            chat: message
          })
          if (this.notifications.indexOf(message.user.user_id) === -1) this.$store.dispatch('chat/addNotification', message.user.user_id)
          this.alert('primary', `${message.user.user_name} te ha enviado un mensaje`)
        }
      })
    }
  }
}
</script>

<style scoped>
/* BASIC NAVBAR COMPONENTS */
.nav-height {
  height: 50px;
}

.nav-icon {
  width: 40px;
  height: 40px;
  margin: auto;
  font-weight: 300;
  font-size: 24px;
}

.nav-title {
  position: relative;
  margin: auto;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  color: #f5f5f5;
}

/* DRAWER NAVBAR COMPONENTS */
.nav-input {
  margin: 12px;
  background-color: rgba(47, 47, 51, 0.95);
  font-size: 18px;
  border-radius: 5px;
}

/* RESPONSIVE CSS */
@media screen
and (min-device-width : 376px)
and (max-device-width : 769px) {
  /* BASIC NAVBAR COMPONENTS */
  .nav-height {
    height: 70px;
  }

  .nav-icon {
    width: 55px;
    height: 55px;
  }

  .nav-title {
    font-size: 1.5rem;
  }

  .nav-burger {
    font-size: 1.1rem;
  }
  /* DRAWER NAVBAR COMPONENTS */
  .nav-input {
    padding: 5px;
    font-size: 22px;
  }
}

@media (min-device-width : 769px) {
  /* BASIC NAVBAR COMPONENTS */
  .nav-height {
    height: 80px;
  }

  .nav-icon {
    width: 60px;
    height: 60px;
  }

  .nav-title {
    font-size: 1.7rem;
  }

  .nav-burger {
    font-size: 1.2rem;
  }
  /* DRAWER NAVBAR COMPONENTS */
  .nav-input {
    font-size: 21px;
  }
}
</style>
