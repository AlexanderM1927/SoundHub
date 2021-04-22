<template>
  <q-dialog class="custom-alert" ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin alert-body">
      <q-form @submit="onOKClick()">
        <div class="q-px-md q-py-sm">
            <div class="text-h6 q-my-xs">
              {{mode}} nueva playlist
            </div>
            <q-input class="alert-input q-pb-none" outlined v-model="playlist.playlist_name" label="Nombre de la playlist" stack-label :rules="[val => !!val || 'Este campo es necesario']">
                <template v-slot:prepend>
                    <q-icon color="black" name="badge" />
                </template>
            </q-input>
        </div>
        <q-card-actions align="right">
            <q-btn color="black" label="OK" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { functions } from '../../functions.js'

export default {
  mixins: [functions],
  props: ['mode'],
  data () {
    return {
      playlist: {
        playlist_name: ''
      }
    }
  },

  mounted () {
    this.cerrarReproductor()
  },

  methods: {
    // following method is REQUIRED
    // (don't change its name --> "show")
    show () {
      this.$refs.dialog.show()
    },

    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide () {
      this.$refs.dialog.hide()
    },

    onDialogHide () {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit('hide')
    },

    onOKClick () {
      this.$emit('ok', this.playlist)
      this.hide()
    },

    onCancelClick () {
      // we just need to hide dialog
      this.hide()
    }
  }
}
</script>
<style scoped>
.alert-body {
  background-color: #dddddd;
}

.alert-input {
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 16px;
}
</style>
