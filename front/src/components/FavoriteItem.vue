<template>
  <div class="row FI-container q-my-md justify-around">
    <!--ITEM IMG-->
    <div class="row col-2 q-mr-sm">
      <q-img class="FI-img" src="../assets/default-user-img.png"/>
    </div>
    <!--ITEM TITLE-->
    <p class="FI-text col-7">Juansito Gamer</p>
    <!--ITEM DELETE-->
    <a class="FI-delete col-1" @click="pintar(true)"> <q-icon name="fas fa-times"/></a>
  </div>
</template>

<style>
.FI-container {
  padding: 7px 0;
  background-color: rgba(54,54,59, .98);
  border-radius: 5px;
}

.FI-img {
  min-width: 60px;
  max-width: 90px;
  margin: auto 0;
  border-radius: 50%;
}

.FI-text {
  margin: auto 0;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 1.24rem;
  color: #f5f5f5;
}

.FI-delete {
  margin: auto 0;
  font-size: 1.7rem;
  color: #e5e5e5;
}

/* RESPONSIVE CSS */
@media screen
and (min-device-width : 376px)
and (max-device-width : 769px) {
  .FI-text {
    font-size: 1.8rem;
  }

  .FI-delete {
    font-size: 2.5rem;
  }
}

@media (min-device-width : 769px) {
  .FI-container {
    padding: 11px 0;
  }

  .FI-text {
    font-size: 2.5rem;
  }

  .FI-delete {
    font-size: 2.8rem;
  }
}
</style>
