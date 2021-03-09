<template>
    <!--LOGIN AND REGISTER PAGE-->
    <div class="lg_body row items-start q-gutter-md">
        <!--IMAGE-->
        <img class="lg_img colum" src="../assets/login-img.svg">
        <!--LOGIN CARD-->
        <div class="lg_card">
            <!--TABS TO CHANGE THE FORM-->
            <q-tabs
             v-model="tab"
             class="lg_tab">
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
                        <q-input square bottom-slots v-model="username" counter label="Username">
                            <template v-slot:append>
                              <q-icon name="close" @click="username = ''" class="cursor-pointer" />
                            </template>
                        </q-input>
                        <q-input label="Password">
                            <template v-slot:append>
                              <q-icon name="close2" @click="password = ''" class="cursor-pointer" />
                            </template>
                        </q-input>
                        <p>¿Olvidaste tu contraseña?</p>
                        <q-btn type="submit" label="login" color="primary"/>
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
    </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      tab: 'sign_in',
      username: '',
      password: ''
    }
  }
}
</script>

<style>
.lg_body{
    overflow: hidden;
    display: flex;
    height: 97vh;
    overflow: hidden;
    background: #43434A;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #F5F5F5,#43434A);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #F5F5F5,#43434A); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

.lg_img{
    width: 40%;
    margin: auto;
}

.lg_card{
    max-width: 600px;
    width: 100%;
    max-height: 80%;
    height: 1000px;
    margin: 50px 50px 0 auto;
    background: #f5f5f5;
    border-radius: 20px;
}

.lg_tab{
    width: 100%;
    background: #43434A;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
}

.tablinks{
    width: 50%;
    height: 45px;
    background-color: #43434A;
    color: #F5F5F5;
    font-weight: 400;
    font-size: 20px;
    border: none;
    cursor: pointer;
}

.tablinks:hover{
    background-color: #4d4d57;
}

.tab_pannels{
    height: 100%;
}

.selected{
    background-color: chocolate;
}

</style>
