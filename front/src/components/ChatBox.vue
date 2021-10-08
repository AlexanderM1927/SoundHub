<template>
  <div class="row pl-container">
    <div class="col-12">
        <div class="text-h6">
            Chat con: {{userTo.user_name}}
        </div>
    </div>
    <q-separator />
    <div class="col-12">
        <div class="row" id="chatBox">
            <div class="col-12" v-for="(message, i) in messages" :key="i">
                <q-chat-message
                    :name="(message.user.user_id === user.user_id) ? 'Yo' : message.user.user_name"
                    :text="[message.message]"
                    :text-html="true"
                    :sent="(message.user.user_id === user.user_id)"
                />
                </div>
        </div>
    </div>
    <q-editor class="full-width" content-class="bg-comment" toolbar-toggle-color="yellow-8" toolbar-bg="pink" v-model="message" min-height="5rem" />
    <br>
    <q-btn class="full-width" label="Comentar" color="pink" @click="sendMessage" />
  </div>
</template>

<script>
import { functions } from '../functions.js'
import { io } from 'socket.io-client'

export default {
  name: 'ChatBox',
  mixins: [functions],
  props: ['userTo', 'messagesProp'],
  data () {
    return {
      socket: {},
      messages: [],
      user: JSON.parse(localStorage.getItem('user')),
      token: localStorage.getItem('token'),
      message: ''
    }
  },
  mounted () {
    this.connectSocket()
    this.getMessagesByProp()
  },
  methods: {
    connectSocket () {
      const server = process.env.API_URL.replace('/v1/', '')
      this.socket = io(server)
      this.socket.on('message', message => {
        if (message.userTo.user_id === this.user.user_id && this.userTo.user_id === message.user.user_id) this.messages.push(message)
        this.scroll()
      })
    },
    sendMessage () {
      const message = {
        user: this.user,
        userTo: this.userTo,
        message: this.message
      }
      this.socket.emit('message', message)
      this.messages.push(message)
      this.$store.dispatch('chat/addChats', {
        chat: message
      })
      this.message = ''
      this.scroll()
    },
    scroll () {
      const chatBox = document.getElementById('chatBox')
      chatBox.scrollTop = chatBox.scrollHeight
    },
    getMessagesByProp () {
      for (let i = 0; i < this.messagesProp.length; i++) {
        if (this.messagesProp[i].chat.userTo.user_id === this.user.user_id ||
        this.messagesProp[i].chat.user.user_id === this.user.user_id) {
          this.messages.push(this.messagesProp[i].chat)
        }
      }
    }
  }
}
</script>

<style>
#chatBox {
    overflow-y: auto;
    overflow-x: hidden;
    height: 40vh;
}
</style>
