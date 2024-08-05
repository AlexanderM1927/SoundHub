<template>
  <div class="content">
    <div class="text-h5" style="font-weight: bold;">{{ soundInfo.title }}</div>
    <br>
    <div class="row">
      <div class="col-12 justify-around">
        <div class="d-flex w-100 justy-center">
          <q-img style="width: 20rem;" :src="soundInfo.img"/>
        </div>
      </div>
    </div>
    <br>
    <div :class="`row col-md-3 col-xs-12 rslt-div-btns justify-around`">
      <!--ADD TO LIST-->
      <q-btn
        class="col-5 q-ml-sm q-mb-xs"
        @click="$emit.agregarSound(soundInfo)"
        color="pink">
        Agregar a playlist
      </q-btn>
      <q-btn
        class="col-5 q-ml-sm q-mb-xs"
        @click="$emit.downloadFile(soundInfo)"
        color="pink"
        icon="download">
        Download
      </q-btn>
    </div>
    <span v-if="soundInfo.type === 'sound'">
      Publicada por:
      <a
        style="
          text-decoration: none;
          color: #DEA559;
          font-weight: bold;
          cursor: pointer;
        "
        @click="goTo('/profile/' + soundInfo.user_id)"
      >
        {{ soundInfo.user }}
      </a>
    </span>
    <div v-if="soundInfo.type === 'sound'">
      <br>
      <q-separator />
      <div class="text-h6">Comentarios:</div>
      <div class="box__comments">
        <comment v-for="(comment, i) in comments" :key="i" :info="comment"></comment>
      </div>
      <q-editor class="full-width" content-class="bg-comment" toolbar-toggle-color="yellow-8" toolbar-bg="pink" v-model="comment" min-height="5rem" />
      <br>
      <q-btn class="full-width" label="Comentar" color="pink" @click="makeComment" />
      <br>
      <br>
      <br>
      <br>
      <br>
    </div>
  </div>
</template>

<script>
import { functions } from '../functions.js'
import Comment from './Comment.vue'
import CommentService from '../services/CommentService'

export default {
  name: 'Player',
  mixins: [functions],
  components: {
    Comment
  },
  props: [
    'user',
    'comments',
    'soundInfo'
  ],
  data () {
    return {
      comment: ''
    }
  },
  methods: {
    async makeComment () {
      if (this.comment.length > 0) {
        const request = await CommentService.store({
          comment: this.comment,
          user_id: this.user.user_id,
          sound_id: this.soundInfo.id
        })
        this.comments.unshift(
          {
            user: {
              user_name: this.user.user_name
            },
            comment_msg: request.data.data.comment_msg
          }
        )
        this.comment = ''
        if (request.status === 200) this.alert('positive', 'Comentario enviado')
      } else {
        this.alert('warning', 'Please, introduce some text')
      }
    }
  }
}
</script>
