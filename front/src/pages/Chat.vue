<template>
  <q-page>
    <div :class="`row justify-around`">
      <div :class="`custom-dark-bg col-md-8 col-xs-12 container`">
        <p class="title text-h6 q-ml-md q-mt-md">Mis chats</p>
        <div
            v-for="(channel, i) in channels"
            :key="i"
            :class="`row custom-dark-div ${(channel.active ? 'bg-pink' : '')}`"
            @click="openModal(i)"
        >
            <p class="pl-title">{{channel.user.user_name}}</p>
        </div>
      </div>
    </div>
    <q-dialog
      v-model="modalChat"
      transition-show="slide-up"
      transition-hide="slide-down"
      :maximized="true"
    >
      <q-card class="pl-card-body">
        <q-bar>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
        <div class="content">
          <ChatBox v-if="channelSelected !== -1" :userTo="channels[channelSelected].user" :messagesProp="chats"></ChatBox>
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { functions } from '../functions.js'
import ChatBox from '../components/ChatBox.vue'

export default {
  name: 'Chat',
  mixins: [functions],
  components: {
    ChatBox
  },
  data () {
    return {
      channels: [],
      modalChat: false,
      channelSelected: -1,
      user: JSON.parse(localStorage.getItem('user'))
    }
  },
  computed: {
    chats: {
      get () {
        return this.$store.state.chat.chats
      }
    },
    notifications: {
      get () {
        return this.$store.state.chat.notifications
      }
    }
  },
  watch: {
    chats () {
      this.getChannels()
    },
    notifications () {
      this.getChannels()
    }
  },
  mounted () {
    this.getChannels()
  },
  methods: {
    isInChannels (val) {
      let res = false
      for (let i = 0; i < this.channels.length; i++) {
        if (this.channels[i].user.user_name === val.user_name) {
          res = true
        }
      }
      return res
    },
    getChannels () {
      for (let i = 0; i < this.chats.length; i++) {
        if (!this.isInChannels(this.chats[i].chat.user) && this.chats[i].chat.user.user_id !== this.user.user_id) {
          const chat = this.chats[i].chat
          chat.active = true
          this.channels.push(chat)
        } else {
          this.channels = this.channels.map((item) => {
            item.active = (this.notifications.indexOf(item.user.user_id) !== -1)
            return item
          })
        }
      }
    },
    openModal (i) {
      this.$store.dispatch('chat/removeNotification', this.channels[i].userTo.user_id)
      this.getChannels()
      this.channelSelected = i
      this.modalChat = true
    }
  }
}
</script>

<style>
.pl-container {
  margin: 10px 5px;
  padding: 5px;
  background-color: rgba(54, 54, 59, .9);
  border-radius: 3px;
}

.pl-title {
  margin: auto;
  padding: 4px;
  font-family: "Inter", sans-serif;
  font-size: 1.2rem;
  font-weight: 300;
  color: #f5f5f5;
  line-height: 20px !important;
}

.margin-auto {
  margin: auto;
}

.pl-delete {
  font-size: 1.1rem;
  cursor: pointer;
}
</style>
