<template>
  <q-page>
    <div class="lg_body">
        <div class="row">
            <div v-if="$q.screen.gt.xs" class="col-md-7 row">
                <img class="lg_img" src="~/assets/login-img.svg">
            </div>
            <div class="col-md-4 col-xs-12" style="opacity: 0.90;">
                <q-tabs
                v-model="tab"
                class="lg_tab"
                indicator-color="primary">
                    <q-tab
                    name="sign_in"
                    class="tablinks tab_left"
                    :class="{ 'selected' : tab=='sign_in'}">
                    Sign in</q-tab>
                    <q-tab
                    name="sign_up"
                    class="tablinks tab_right"
                    :class="{ 'selected' : tab=='sign_up' }">
                    Sign Up</q-tab>
                </q-tabs>

                <!--CARD CONTENT-->
                <q-tab-panels
                v-model="tab"
                class="tab_pannels"
                animated>
                    <!--LOGIN-->
                    <q-tab-panel
                    name="sign_in"
                    class="tabcontent">
                        <q-form
                        @submit="login"
                        action="submit"
                        class="col-md-4 col-xs-12">
                            <q-input outlined v-model="user.user_email" label="Email" stack-label  required :rules="[val => !!val || 'Este campo es necesario']">
                                <template v-slot:prepend>
                                    <q-icon color="grey" name="mail" />
                                </template>
                            </q-input><br>
                            <q-input outlined v-model="user.user_password" label="Clave" stack-label :type="isPwd ? 'password' : 'text'" required :rules="[val => !!val || 'Este campo es necesario']">
                                <template v-slot:prepend>
                                    <q-icon color="grey" name="vpn_key" />
                                </template>
                                <template v-slot:append>
                                    <q-icon color="grey" :name="isPwd ? 'visibility_off' : 'visibility'" @click="isPwd = !isPwd"/>
                                </template>
                            </q-input>
                            <div class="row q-my-sm">
                                <a class="link">¿Olvidaste tu contraseña?</a>
                            </div>
                            <q-btn type="submit" class="full-width q-mt-sm" label="login" color="grey"/>
                        </q-form>
                        <q-btn type="submit" icon="facebook" class="full-width q-mt-sm" label="Iniciar con facebook" color="primary" @click="loginWithFacebook"/>
                    </q-tab-panel>
                    <!--REGISTER-->
                    <q-tab-panel
                    name="sign_up"
                    class="tabcontent">
                        <q-form
                        @submit="register"
                        action="submit"
                        class="col-md-4 col-xs-12">
                            <q-input outlined v-model="user.user_name" label="Nombre" stack-label  required :rules="[val => !!val || 'Este campo es necesario']">
                                <template v-slot:prepend>
                                    <q-icon color="grey" name="badge" />
                                </template>
                            </q-input><br>
                            <q-input outlined type="mail" v-model="user.email" label="Email" stack-label  required :rules="[val => !!val || 'Este campo es necesario']">
                                <template v-slot:prepend>
                                    <q-icon color="grey" name="email" />
                                </template>
                            </q-input><br/>
                            <q-input outlined v-model="user.password" label="Clave" stack-label :type="isPwd1 ? 'password' : 'text'" required :rules="[val => !!val || 'Este campo es necesario']">
                                <template v-slot:prepend>
                                    <q-icon color="grey" name="vpn_key" />
                                </template>
                                <template v-slot:append>
                                    <q-icon color="grey" :name="isPwd1 ? 'visibility_off' : 'visibility'" @click="isPwd1 = !isPwd1"/>
                                </template>
                            </q-input><br/>
                            <q-input outlined v-model="user.user_passwordConfirm" label="Confirmar clave" stack-label :type="isPwd2 ? 'password' : 'text'" required :rules="[val => !!val || 'Este campo es necesario']">
                                <template v-slot:prepend>
                                    <q-icon color="grey" name="vpn_key" />
                                </template>
                                <template v-slot:append>
                                    <q-icon color="grey" :name="isPwd2 ? 'visibility_off' : 'visibility'" @click="isPwd2 = !isPwd2"/>
                                </template>
                            </q-input>
                            <q-btn type="submit" class="full-width q-mt-sm" label="Register" color="grey"/>
                        </q-form>
                    </q-tab-panel>
                </q-tab-panels>
            </div>
            <div v-if="$q.screen.gt.xs" class="col-1"></div>
        </div>
    </div>
  </q-page>
</template>

<script>
import UserService from '../services/UserService'
import { functions } from '../functions.js'

export default {
  name: 'PageIndex',
  mixins: [functions],
  data () {
    return {
      tab: 'sign_in',
      user: {
        user_name: '',
        user_email: '',
        user_password: '',
        user_passwordConfirm: ''
      },
      isPwd: true,
      isPwd1: true,
      isPwd2: true
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

<style lang="scss" scoped>
.lg_body{
    // background-size: 100%;
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
    max-width: 900px;
    width: 100%;
    height: auto;
    margin: 11% auto 0 auto;
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
