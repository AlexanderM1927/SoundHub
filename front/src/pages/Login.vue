<template>
  <div class="lg_body">
      <img class="lg_img" src="../assets/login-img.svg">
      <div class="row">
          <div class="col-md-7"></div>
          <div class="col-md-4 col-xs-12 lg_tab">
            <div class="box">
              Hola
            </div>
          </div>
          <div class="col-1"></div>
      </div>
  </div>
</template>

<script>
import UserService from '../services/UserService'
import { functions } from '../functions.js'

export default {
  name: 'PageIndex',
  mixins: [functions],
  data () {
    return {
      user: {
        user_name: '',
        user_email: '',
        user_password: '',
        user_passwordConfirm: ''
      }
    }
  },
  methods: {
    async loginWithFacebook () {
      console.log('login-facebook')
    },
    async login () {
      console.log('login')
    },
    async register () {
      try {
        this.activateLoading()
        if (this.user.user_password === this.user.user_passwordConfirm) {
          const request = await UserService.register(this.user)
          if (request.status === 200) this.alert('positive', 'Usuario creado correctamente')
        }
        this.tab = 'sign_in'
      } catch (error) {
        this.alert('negative', error.response.data.error)
      }
      this.disableLoading()
    }
  }
}
</script>

<style scoped>
.box {
  background: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0px 0px 0 rgba(0,0,0,.14), 0 0px 10px 0 rgba(0,0,0,.12), 0 2px 4px -1px rgba(0,0,0,.3);
}

.lg_body{
    /* background-size: 100%; */
    background-image: url('../assets/login-background.jpg');
    background-position: center center;
    height: 100%;
}

.lg_card{
    width: 100%;
    background: #f5f5f5;
    border-radius: 20px;
}

.lg_img {
  position: absolute;
  bottom: -10px;
  width: 50%;
  height: auto;
}

.lg_tab{
    margin-top: 20%;
    width: 100%;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
}

.tablinks{
    width: 50%;
    height: 45px;
    background-color: #2b2b30;
    color: #F5F5F5;
    font-weight: 400;
    font-size: 20px;
    border: none;
    cursor: pointer;
}

.tablinks:hover{
    background-color: #38383f;
}

.selected{
    background-color: #3d393f;
}

</style>
