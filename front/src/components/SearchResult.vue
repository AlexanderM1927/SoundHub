<template>
    <div class="container row search_item justify-around">
        <q-img src="../assets/search-thumbnail.jpg" class="col-3 q-my-sm"></q-img>
        <div class="content q-my-sm col-8" >
            <p class="item_title item_font">Título del vídeo</p>
            <p class="item_font">100,000 reproducciones | Subido 1 año</p>
            <p class="item_font">Descripción básica del vídeo de mierda</p>
        </div>
    </div>
</template>

<script>
export default {
  name: 'SearchResult'
}
</script>

<style>

.content {
    color: #E83845;
}

.item_title {
    font-size: 20px;
    font-weight: 500;
    line-height: 20px !important;
}

.item_font {
    color: #f5f5f5;
    font-family: 'Quicksand', sans-serif;
}

</style>
