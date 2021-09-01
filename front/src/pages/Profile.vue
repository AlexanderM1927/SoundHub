<template>
  <div class="row">
    <!--PROFILE IMAGE-->
    <div class="row prfl-img-div col-12">
      <div class="prfl-img">
        <label for="prfl-filepicker">
          <img class="prfl-img" src="../assets/default-user-img.png"/>
        </label>

        <input id="prfl-filepicker" type="file" />
      </div>
    </div>
    <!--TEXT FIELDS-->
    <q-form class="row prfl-form justify-around full-width" action="submit">
      <!--BASIC INFORMATION-->
      <q-input class="prfl-input col-11" v-model="name" label="Nombre" dark borderless></q-input>
      <q-input class="prfl-input col-11" v-model="country" label="País" dark borderless></q-input>
      <q-input class="prfl-input col-11" v-model="cel" label="Celular" dark borderless></q-input>

      <!--EMAIL INFORMATION-->
      <q-input class="prfl-input col-11" v-model="email" label="Correo" dark borderless></q-input>
      <q-input class="prfl-input col-11" v-model="password" label="Contraseña" dark borderless :type="isHidden ? 'password' : 'text'" required>
        <template v-slot:append>
            <q-icon color="white" :name="isHidden ? 'visibility_off' : 'visibility'" @click="isHidden = !isHidden"/>
        </template>
      </q-input>

      <q-input class="prfl-input col-11" v-model="password2" label="Confirmación" dark borderless :type="isHidden2 ? 'password' : 'text'" required>
        <template v-slot:append>
            <q-icon color="white" :name="isHidden2 ? 'visibility_off' : 'visibility'" @click="isHidden2 = !isHidden2"/>
        </template>
      </q-input>
      <!--BUTTON-->
      <div class="row full-width justify-around">
        <q-btn class="yellow-btn col-5" label="Modificar" type="submit" color="orange"/>
        <q-btn class="yellow-btn col-5" label="Reiniciar" type="reset" color="orange"/>
      </div>
    </q-form>
  </div>
</template>

<script>
export default {
  name: 'profile',
  data () {
    return {
      img: '../assets/default-user-img.png',
      name: '',
      email: '',
      password: '',
      password2: '',
      country: '',
      cel: '',
      isHidden: true,
      isHidden2: true
    }
  }
}
</script>

<style>
/* IMAGE STYLES */
.prfl-img-div {
  height: 8rem !important;
  background-color: rgba(54, 54, 59, .95);
}

.prfl-img {
  max-width: 300px;
  min-width: 170px;
  width: 40%;
  margin: auto auto -40px auto;
  border-radius: 50%;
}

.prfl-img>input {
  display: none;
}

/* FORM STYLES */
.prfl-form {
  margin: 6rem 1rem 2.5rem 1rem;
}

.prfl-input {
  margin-bottom: 1rem;
  padding: 0 10px;
  background-color: rgba(54, 54, 59, .92);
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  border-radius: 10px;
}
</style>
