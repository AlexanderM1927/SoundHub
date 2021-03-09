<template>
    <!--LOGIN AND REGISTER PAGE-->
    <div class="lg_body">
        <div class="row">
            <div v-if="$q.screen.gt.xs" class="col-md-7">
                <img class="lg_img" src="~/assets/login-img.svg">
            </div>
            <div class="col-md-4 col-xs-12">
                <q-tabs
                v-model="tab"
                class="lg_tab bg-purple">
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

                <q-separator />

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
                        action="submit"
                        class="col-md-4 col-xs-12">
                            <q-input outlined v-model="user.email" label="Email" stack-label :dense="dense"  required :rules="[val => !!val || 'Este campo es necesario']">
                                <template v-slot:prepend>
                                    <q-icon color="accent" name="email" />
                                </template>
                            </q-input><br>
                            <q-input outlined v-model="user.email" label="Clave" stack-label :dense="dense" :type="isPwd ? 'password' : 'text'" required :rules="[val => !!val || 'Este campo es necesario']">
                                <template v-slot:append>
                                    <q-icon color="accent" :name="isPwd ? 'visibility_off' : 'visibility'" @click="isPwd = !isPwd"/>
                                </template>
                            </q-input>
                            <p>¿Olvidaste tu contraseña?</p>
                            <q-btn type="submit" class="full-width" label="login" color="accent"/>
                        </q-form>
                    </q-tab-panel>
                    <!--REGISTER-->
                    <q-tab-panel
                    name="sign_up"
                    class="tabcontent">
                        <div>
                            <h3>Sing up</h3>
                            <p>Aquí va el texto para registro</p>
                        </div>
                    </q-tab-panel>
                </q-tab-panels>
            </div>
            <div v-if="$q.screen.gt.xs" class="col-1"></div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'LoginComponent',
  data () {
    return {
      tab: 'sign_in',
      user: {
        email: '',
        password: ''
      },
      isPwd: true
    }
  }
}
</script>

<style lang="scss" scoped>
.lg_body{
    height: 100vh;
    width: 100%;
    background: #43434A;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #F5F5F5,#43434A);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #F5F5F5,#43434A); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

.lg_card{
    width: 100%;
    background: #f5f5f5;
    border-radius: 20px;
}

.lg_img {
    width: 100%;
    height: auto;
    margin-top: 11%;
}

.lg_tab{
    margin-top: 20%;
    width: 100%;
    background: $accent;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
}

.tablinks{
    width: 50%;
    height: 45px;
    background-color: $accent;
    color: #F5F5F5;
    font-weight: 400;
    font-size: 20px;
    border: none;
    cursor: pointer;
}

.tablinks:hover{
    background-color: $accent;
}

.selected{
    background-color: $accent;
}

</style>
