<template>
  <q-page>
    <div class="lg_body row justify-around">
      <div class="col-md-4">
        <q-card class="my-card q-mt-xl">
          <!-- TITLE -->
          <q-card-section class="bg-grey text-white">
            <div class="text-h6">Recuperar cuenta</div>
          </q-card-section>

          <q-separator />

          <!--CONTENT-->
          <q-card-actions class="row col-12">
            <q-form class="row col-12 justify-around">
              <p class="p_recovery q-ma-md">
                Ingresa el correo relaciondo a tu cuenta y te enviaremos un
                código de verificación
              </p>
              <q-input
                outlined
                type="mail"
                v-model="recovery_email"
                label="Email"
                class="col-12 q-ma-sm"
              >
                <template v-slot:prepend>
                  <q-icon color="grey" name="email" />
                </template>
              </q-input>
              <!-- SUBMIT BTN -->
              <q-btn
                type="submit"
                class="col-12 q-mt-sm"
                label="Enviar"
                color="grey"
              />
            </q-form>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      recovery_email: ''
    }
  }
}
</script>

<style scoped>
.lg_body {
  height: 100vh;
  background-image: url("../assets/login-background.jpg");
  background-position: center center;
}

.p_recovery {
  font-weight: 400;
  font-size: 20px;
  color: #43434a;
  text-align: justify;
}
</style>
