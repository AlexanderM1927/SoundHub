<template>
  <q-item
    clickable
    tag="a"
    target="_blank"
    :href="to"
    class="item-container q-pt-lg q-pb-lg"
  >
    <!--ICON-->
    <q-item-section
      v-if="icon"
      avatar
      class="item-content"
    >
      <q-icon :name="icon" />
    </q-item-section>
    <!--TITLE -->
    <q-item-section class="item-content">
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
    <q-separator :key="'sep' + index"  v-if="menuItem.separator" />
  </q-item>
</template>

<script>
export default {
  name: 'NavLink',
  props: {
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: ''
    },
    to: {
      type: String,
      default: '#',
      required: true
    },
    separator: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>

</style>
