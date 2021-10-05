<template>
  <div class="row">
    <!--PROFILE HEAD-->
    <div class="row prfl-img-div col-12">
      <!--FOLLOW ICON-->
      <template v-if="notmyprofile === true">
        <q-btn flat :ripple="false" class="prfl-favorite-btn q-mt-md" @click="follow = !follow">
          <i :class="follow ? 'fas fa-heart prfl-fv-i-active' : 'far fa-heart prfl-fv-i-inactive'"></i>
        </q-btn>
      </template>
      <!--PROFILE IMAGE-->
      <div class="prfl-img">
        <label for="prfl-filepicker">
          <img class="prfl-img" src="../assets/default-user-img.png"/>
        </label>

        <input id="prfl-filepicker" type="file" />
      </div>
    </div>

    <!--PROFILE DATA-->
    <q-form class="row prfl-form justify-around full-width" action="submit">
      <!--BASIC INFORMATION-->
      <q-input class="prfl-input col-11" v-model="name" label="Nombre" dark borderless :disable="notmyprofile"></q-input>
      <q-input class="prfl-input col-11" v-model="country" label="País" dark borderless :disable="notmyprofile"></q-input>

      <template v-if="!notmyprofile">
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
        <!--BUTTONS-->
        <div class="row full-width justify-around">
          <q-btn class="yellow-btn col-5" label="Modificar" type="submit" color="orange"/>
          <q-btn class="yellow-btn col-5" label="Reiniciar" type="reset" color="orange"/>
        </div>
      </template>
    </q-form>
    <template v-if="notmyprofile">
      <p class="title text-h6 q-ml-md">Listas de {{name}}</p>
      <PlaylistResult :result="result" :tiny="mode === 'adding'" :notmyprofile="false" />
    </template>
  </div>
</template>

<script>
export default {
  name: 'profile',
  props: {
    notmyprofile: {
      type: Boolean,
      default: true
    },
    follower: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      follow: this.follower,
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
/* FAVORITE ICON */
.prfl-favorite-btn {
  position: absolute;
  display: flex;
  justify-content: center;

  left: 5vw;
  height: 60px;
  width: 60px;
  border-radius: 50%;

  font-size: 38px;
}

.prfl-fv-i-active {
  color: #d1234f;
  transition: 0.35s;
}

.prfl-fv-i-inactive {
  color: #ffe9ef;
  transition: 0.35s;
}

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
