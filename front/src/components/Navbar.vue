<template>
  <div>
    <q-header elevated class="bg-grey">
        <q-toolbar>
          <q-btn flat @click="side_options = !side_options" round dense icon="menu" />
          <q-toolbar-title class="uwu">SoundHub</q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="side_options"
        show-if-above
        :width="300"
        :breakpoint="500"
        bordered
        content-class="bg-grey q-pt-md"
      >
        <q-scroll-area class="fit">
          <q-list>
            <!--SEARCH BAR-->
            <q-item>
              <q-input dark dense borderless @keyup.enter="search()" v-model="search_content" class="q-ml-xs search_input full-width" placeholder="Buscar...">
                <template v-slot:prepend>
                    <q-icon v-if="search_content === ''" name="fas fa-search" />
                    <q-icon v-else name="fas fa-times" class="cursor-pointer" @click="search_content = ''" />
                </template>
              </q-input>
            </q-item>
            <!--ITEMS-->
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
const menuList = [
  {
    title: 'Inicio',
    icon: 'far fa-home',
    to: '/',
    separator: true
  },
  {
    title: 'Login',
    icon: 'far fa-sign-in',
    to: '/login',
    separator: true,
    isLogin: false
  },
  {
    title: 'Perfil',
    icon: 'far fa-user-circle',
    separator: true,
    isLogin: true
  },
  {
    title: 'Favoritos',
    icon: 'fas fa-heart',
    separator: false,
    isLogin: true
  },
  {
    title: 'Mis listas',
    icon: 'fas fa-play',
    separator: false,
    isLogin: true
  },
  {
    title: 'Salir',
    icon: 'fas fa-sign-out-alt',
    to: '/logout',
    separator: false,
    isLogin: true
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
      token: localStorage.getItem('token')
    }
  },
  computed: {
    searchText: {
      get () {
        return this.$store.state.sounds.searchText
      }
    }
  },
  watch: {
    searchText () {
      this.search_content = this.searchText
    }
  },
  methods: {
    delete_search () {
      this.search_content = ''
    },
    async search () {
      await this.$store.dispatch('sounds/getItemsByName', {
        name: this.search_content
      })
      this.goTo('search/' + this.search_content)
      // location.href = '/search/' + this.search_content
    }
  }
}
</script>

<style>
.search_input{
  padding-left: 10px;
  background-color: #505057;
  font-size: 18px;
  border-radius: 5px;
}

.light_font {
  color: #f5f5f5;
  font-size: 16px;
}

.uwu {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
}
</style>
