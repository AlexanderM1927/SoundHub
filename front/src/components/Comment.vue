<template>
  <div class="row pl-container">
    <div class="col-12">
        <q-chat-message
            :name="info.user.user_name"
            :text="[info.comment_msg]"
            :text-html="true"
        />
    </div>
  </div>
</template>

<script>
import { functions } from '../functions.js'

export default {
  name: 'Comment',
  mixins: [functions],
  props: ['info'],
  data () {
    return {
    }
  }
}
</script>

<style>
</style>
