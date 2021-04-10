<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-form @submit="onOKClick()">
        <div class="form">
            <div class="text-h6">
              Subir nueva canción
            </div>
            <q-img :src="window.createObjectURL(sound.sound_thumbnail_url)" v-if="sound.sound_thumbnail_url" ></q-img>
            <q-file
              v-model="sound.sound_thumbnail_url"
              :label="'Thumbnail'"
              outlined
              accept=".jpg, .png"
              lazy-rules
              use-chips
              :rules="[
                val => (val !== null && val !== undefined) || 'Seleccionar imagen'
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
              <template v-slot:append>
                <q-icon name="help">
                  <q-tooltip>
                    Seleccionar archivo
                  </q-tooltip>
                </q-icon>
              </template>
            </q-file>
            <q-file
              v-model="sound.sound_file_url"
              :label="'Canción'"
              outlined
              accept=".mp3"
              lazy-rules
              use-chips
              :rules="[
                val => (val !== null && val !== undefined) || 'Seleccionar canción'
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
              <template v-slot:append>
                <q-icon name="help">
                  <q-tooltip>
                    Seleccionar archivo
                  </q-tooltip>
                </q-icon>
              </template>
            </q-file>
            <q-input outlined v-model="sound.sound_name" label="Nombre de la canción" stack-label :rules="[val => !!val || 'Este campo es necesario']">
                <template v-slot:prepend>
                    <q-icon color="grey" name="badge" />
                </template>
            </q-input><br>
        </div>
        <q-card-actions align="right">
            <q-btn color="black" label="OK" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  data () {
    return {
      window: window.URL,
      sound: {
        sound_thumbnail_url: null,
        sound_file_url: null,
        sound_name: ''
      }
    }
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
      this.$emit('ok', this.sound)
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
.form {
    padding: 10px;
}
</style>
