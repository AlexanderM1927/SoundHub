<template>
    <div class="row justify-around search_body">
        <div class="col-md-8 col-xs-12 search_result">
            <p class="search_title q-ml-md q-mt-md">RESULTADOS DE LA BÚSQUEDA</p>
            <q-separator></q-separator>
            <Search />
            <q-separator></q-separator>
            <Search />
            <q-separator></q-separator>
            <Search />
            <q-separator></q-separator>
        </div>
    </div>
</template>

<script>
import Search from '../components/SearchResult.vue'

export default {
  components: { Search }
}
</script>

<style>
.search_body {
    width: 100%;
    height: 100vh;
    background-image: url('../assets/login-background.jpg');
    background-position: center center;
}

.search_title {
    font-size: 20px;
    color: #c5c5c5;
}

.search_result {
    height: 100vh;
    background-color: #36363b;
}
</style>
