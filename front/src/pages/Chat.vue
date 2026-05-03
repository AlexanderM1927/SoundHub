<template>
  <q-page class="chat-page">
    <div class="row justify-around q-pa-md">
      <div class="col-md-6 col-sm-8 col-xs-12">
        <p class="text-h6 text-white q-mb-md">
          <q-icon name="chat" class="q-mr-sm" />Mis chats
        </p>
        <div
          v-if="channels.length === 0"
          class="text-center text-grey-6 q-py-xl"
        >
          <q-icon name="forum" size="56px" class="q-mb-sm" />
          <p>No tienes conversaciones aún</p>
        </div>
        <q-list separator dark class="rounded-borders channel-list">
          <q-item
            v-for="(channel, i) in channels"
            :key="i"
            clickable
            v-ripple
            @click="openModal(i)"
            class="channel-item"
          >
            <q-item-section avatar>
              <q-avatar color="pink-8" text-color="white" size="44px" class="text-weight-bold">
                {{ channel.user.user_name.charAt(0).toUpperCase() }}
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-white text-weight-medium">{{ channel.user.user_name }}</q-item-label>
            </q-item-section>
            <q-item-section side v-if="channel.active">
              <q-badge color="pink" rounded />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>

    <q-dialog
      v-model="modalChat"
      transition-show="slide-up"
      transition-hide="slide-down"
      :maximized="true"
    >
      <q-card class="chat-modal-card column no-wrap">
        <q-btn
          dense
          flat
          round
          icon="arrow_back"
          color="white"
          v-close-popup
          class="chat-back-btn"
        />
        <ChatBox
          v-if="channelSelected !== -1"
          :userTo="channels[channelSelected].user"
          :messagesProp="chats"
          class="col"
        />
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

<style scoped>
.chat-page {
  background-color: #18181d;
  min-height: 100vh;
}

.channel-list {
  background-color: #28282f;
  border-radius: 8px;
  overflow: hidden;
}

.channel-item {
  transition: background-color 0.2s;
  min-height: 64px;
}

.channel-item:hover {
  background-color: rgba(233, 30, 99, 0.08);
}

.chat-modal-card {
  background-color: #1e1e24;
  height: 100%;
  position: relative;
}

.chat-back-btn {
  position: absolute;
  top: 11px;
  right: 12px;
  z-index: 10;
}
</style>
