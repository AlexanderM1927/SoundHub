<template>
    <div class="container row search_item justify-around">
        <q-img :src="result.thumbnail.thumbnails[0].url" class="col-3 q-my-sm"></q-img>
        <div class="content q-my-sm col-8" >
            <p class="item_title item_font">{{result.title}}</p>
            <p class="item_font">{{result.length.accessibility.accessibilityData.label}}</p>
        </div>
    </div>
</template>

<script>
export default {
  name: 'SearchResult',
  props: ['result']
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
