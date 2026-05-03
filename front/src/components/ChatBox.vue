<template>
  <div class="chatbox-wrapper column no-wrap">
    <!-- Header -->
    <div class="chatbox-header row items-center q-px-md q-py-sm">
      <q-avatar color="pink-8" text-color="white" size="42px" class="q-mr-sm text-weight-bold">
        {{ userTo.user_name.charAt(0).toUpperCase() }}
      </q-avatar>
      <div class="col">
        <div class="text-subtitle1 text-weight-bold text-white">{{ userTo.user_name }}</div>
      </div>
    </div>

    <q-separator dark />

    <!-- Messages area -->
    <div class="chatbox-messages col q-pa-md" id="chatBox">
      <div v-if="messages.length === 0" class="flex flex-center full-height">
        <div class="text-center text-grey-6">
          <q-icon name="chat_bubble_outline" size="48px" class="q-mb-sm" />
          <p>Inicia la conversación</p>
        </div>
      </div>
      <div v-for="(message, i) in messages" :key="i" class="q-mb-xs">
        <q-chat-message
          :name="(message.user.user_id === user.user_id) ? 'Yo' : message.user.user_name"
          :text="[message.message]"
          :text-html="true"
          :sent="(message.user.user_id === user.user_id)"
          :bg-color="(message.user.user_id === user.user_id) ? 'pink-8' : 'grey-9'"
          text-color="white"
        />
      </div>
    </div>

    <q-separator dark />

    <!-- Input area -->
    <div class="chatbox-input row items-end q-pa-sm no-wrap">
      <q-input
        v-model="message"
        dark
        dense
        rounded
        outlined
        placeholder="Escribe un mensaje..."
        class="col q-mr-sm"
        autogrow
        @keydown.enter.exact.prevent="sendMessage"
      />
      <q-btn
        round
        flat
        color="pink"
        icon="send"
        size="md"
        @click="sendMessage"
        :disable="!message || !message.trim()"
      />
    </div>
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

<style scoped>
.chatbox-wrapper {
  height: 100%;
  background-color: #1e1e24;
}

.chatbox-header {
  background-color: #28282f;
  min-height: 64px;
}

.chatbox-messages {
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1 1 auto;
  background-color: #1e1e24;
}

.chatbox-input {
  background-color: #28282f;
  min-height: 60px;
}
</style>
