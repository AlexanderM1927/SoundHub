<template>
  <q-page>
    <div class="lg_body">
        <div class="row justify-around">
            <div v-if="$q.screen.gt.xs" class="col-md-7 col-sm-0 row">
                <img class="lg_img" src="~/assets/login-img.svg">
            </div>
            <div class="col-md-4 col-sm-9 col-xs-11" style="opacity: 0.90;">
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
                        @submit="login()"
                        action="submit"
                        class="col-md-4 col-xs-12">
                            <q-input class="lg-inputs" outlined v-model="user.user_email" label="Email"  required :rules="[val => !!val || 'Este campo es necesario']">
                                <template v-slot:prepend>
                                    <q-icon color="grey" name="mail" />
                                </template>
                            </q-input><br>
                            <q-input class="lg-inputs" outlined v-model="user.user_password" label="Clave" :type="isPwd ? 'password' : 'text'" required :rules="[val => !!val || 'Este campo es necesario']">
                                <template v-slot:prepend>
                                    <q-icon color="grey" name="vpn_key" />
                                </template>
                                <template v-slot:append>
                                    <q-icon color="grey" :name="isPwd ? 'visibility_off' : 'visibility'" @click="isPwd = !isPwd"/>
                                </template>
                            </q-input>
                            <div class="row q-mb-sm">
                                <q-btn class="inter" flat to="/recovery">¿Olvidaste tu contraseña?</q-btn>
                            </div>
                            <q-btn type="submit" class="inter full-width q-mt-sm" label="login" color="grey"/>
                        </q-form>
                        <q-btn type="submit" icon="facebook" class="inter full-width q-mt-sm" label="Iniciar con facebook" color="primary" @click="loginWithFacebook"/>
                    </q-tab-panel>
                    <!--REGISTER-->
                    <q-tab-panel
                    name="sign_up"
                    class="tabcontent">
                        <q-form
                        @submit="register()"
                        action="submit"
                        class="col-md-4 col-xs-12">
                            <q-input class="lg-inputs" outlined v-model="user.user_name" label="Nombre"  required :rules="[val => !!val || 'Este campo es necesario']">
                                <template v-slot:prepend>
                                    <q-icon color="grey" name="badge" />
                                </template>
                            </q-input><br>
                            <q-input class="lg-inputs" outlined type="mail" v-model="user.user_email" label="Email"  required :rules="[val => !!val || 'Este campo es necesario']">
                                <template v-slot:prepend>
                                    <q-icon color="grey" name="email" />
                                </template>
                            </q-input><br/>
                            <q-input class="lg-inputs" outlined v-model="user.user_password" label="Clave" :type="isPwd1 ? 'password' : 'text'" required :rules="[val => !!val || 'Este campo es necesario']">
                                <template v-slot:prepend>
                                    <q-icon color="grey" name="vpn_key" />
                                </template>
                                <template v-slot:append>
                                    <q-icon color="grey" :name="isPwd1 ? 'visibility_off' : 'visibility'" @click="isPwd1 = !isPwd1"/>
                                </template>
                            </q-input><br/>
                            <q-input class="lg-inputs" outlined v-model="user.user_passwordConfirm" label="Confirmar clave" :type="isPwd2 ? 'password' : 'text'" required :rules="[val => !!val || 'Este campo es necesario']">
                                <template v-slot:prepend>
                                    <q-icon color="grey" name="vpn_key" />
                                </template>
                                <template v-slot:append>
                                    <q-icon color="grey" :name="isPwd2 ? 'visibility_off' : 'visibility'" @click="isPwd2 = !isPwd2"/>
                                </template>
                            </q-input>
                            <q-btn type="submit" class="inter full-width q-mt-sm" label="Register" color="grey"/>
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
      this.alert('warning', 'Proximamente')
    },
    async login () {
      try {
        const data = {
          user_email: this.user.user_email,
          user_password: this.user.user_password
        }
        const request = await UserService.login(data)
        if (request.status >= 200 & request.status < 300) {
          localStorage.setItem('token', request.data.data.token)
          localStorage.setItem('user', JSON.stringify(request.data.data.user))
          location.href = '/'
        }
      } catch (error) {
        this.alert('negative', error.response.data.error)
      }
    },
    async register () {
      try {
        this.activateLoading()
        if (this.user.user_password === this.user.user_passwordConfirm) {
          const request = await UserService.register(this.user)
          if (request.status === 200) {
            this.alert('positive', 'Usuario creado correctamente')
            this.tab = 'sign_in'
          }
        } else {
          console.log(this.user)
          this.alert('negative', 'Las claves no coinciden')
        }
      } catch (error) {
        this.alert('negative', error.response.data.error)
      }
      this.disableLoading()
    }
  }
}
</script>

<style scoped>
.lg_body{
  height: 100vh;
  background-image: url('../assets/login-background.jpg');
  background-position: center center;
}

.inter {
  font-family: 'Inter', sans-serif;
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

.lg_tab {
  width: 100%;
  margin-top: 20%;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.lg-inputs {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 1.1rem;
}

.tablinks{
  width: 50%;
  height: 45px;
  background-color: #2b2b30;
  font-weight: 400;
  font-size: 20px;
  color: #F5F5F5;
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
