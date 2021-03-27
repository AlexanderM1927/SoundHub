<template>
    <q-header class="bg-grey" elevated>
        <q-toolbar class="row justify-around">
            <div class="col-3">
                <q-toolbar-title>
                SoundHub
                </q-toolbar-title>
            </div>

            <div class="col-6">
                <q-input dark dense borderless v-model="search_content" class="q-ml-md search_input">
                <template v-slot:prepend>
                    <q-icon v-if="search_content === ''" name="fas fa-search" />
                    <q-icon v-else name="fas fa-times" class="cursor-pointer" @click="search_content = ''" />
                </template>
                </q-input>
            </div>

            <div class="row col-3 justify-end">
                <q-btn flat class="no-ripple" @click="logout">
                    <q-icon name="fas fa-sign-out-alt"></q-icon>
                </q-btn>
            </div>
        </q-toolbar>
    </q-header>
</template>

<script>
export default {
  name: 'Navbar',
  data () {
    return {
      search_content: ''
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
    font-size: 20px;
    border-radius: 5px;
}
</style>
