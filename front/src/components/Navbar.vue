<template>
  <div>
    <q-header elevated class="bg-grey">
        <q-toolbar>
          <q-btn flat @click="side_options = !side_options" round dense icon="menu" />
          <q-toolbar-title>SoundHub</q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="side_options"
        show-if-above
        :width="300"
        :breakpoint="500"
        bordered
        content-class="bg-grey"
      >
        <q-scroll-area class="fit">
          <q-list>
            <!--SEARCH BAR-->
            <q-item>
              <q-input dark dense borderless v-model="search_content" class="q-ml-xs search_input full-width" placeholder="Buscar...">
                <template v-slot:prepend>
                    <q-icon v-if="search_content === ''" name="fas fa-search" />
                    <q-icon v-else name="fas fa-times" class="cursor-pointer" @click="search_content = ''" />
                </template>
              </q-input>
            </q-item>
            <!--ITEMS-->
            <template v-for="(menuItem, index) in menuList">
              <q-item class="light_font" :key="index" clickable :active="menuItem.label === 'Outbox'" v-ripple>
                <q-item-section avatar>
                  <q-icon :name="menuItem.icon"/>
                </q-item-section>
                <q-item-section >
                  {{ menuItem.label }}
                </q-item-section>
              </q-item>
              <q-separator :key="'sep' + index"  v-if="menuItem.separator" />
            </template>
          </q-list>
        </q-scroll-area>
      </q-drawer>
    </div>
</template>

<script>
import { functions } from '../functions.js'
const menuList = [
  {
    icon: 'far fa-user-circle',
    label: 'Perfil',
    separator: true
  },
  {
    icon: 'fas fa-heart',
    label: 'Favoritos',
    separator: false
  },
  {
    icon: 'fas fa-play',
    label: 'Mis listas',
    separator: false
  },
  {
    icon: 'fas fa-bell',
    label: 'Notificaciones',
    separator: true
  },
  {
    icon: 'fas fa-sign-out-alt',
    iconColor: 'primary',
    label: 'Salir',
    separator: false
  }
]
export default {
  name: 'Navbar',
  mixins: [functions],
  data () {
    return {
      search_content: '',
      side_options: true,
      menuList
    }
  },
  methods: {
    delete_search () {
      this.search_content = ''
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
</style>
