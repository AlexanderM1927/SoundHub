<template>
  <div class="row pl-container">
    <div class="col-12" v-for="(message, i) in messages" :key="i">
      <q-chat-message
        :name="message.userTo.user_name"
        :text="[message.msg]"
        :text-html="true"
        :sent="(user.user_id === message.userTo.user_id)"
      />
    </div>
  </div>
</template>

<script>
import { functions } from '../functions.js'
import io from 'socket.io-client'

export default {
  name: 'Chat',
  mixins: [functions],
  props: ['userTo'],
  data () {
    return {
      socket: {},
      messages: [],
      user: JSON.parse(localStorage.getItem('user')),
      token: localStorage.getItem('token')
    }
  },
  mounted () {
    this.connectSocket()
  },
  methods: {
    connectSocket () {
      this.socket = io(process.env.API_URL)
      this.sendMessage()
      this.socket.on('chat:message', message => {
        this.messages.push(message)
      })
    },
    sendMessage () {
      this.socket.emit('chat:message', {
        user: this.user,
        userTo: this.userTo,
        message: 'Hola mundo'
      })
    }
  }
}
</script>

<style>
</style>
