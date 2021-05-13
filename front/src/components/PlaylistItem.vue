<template>
    <div class="row custom-dark-div">
      <q-img class="pli-img col-3" src="../assets/lofi-hiphop.jpg"></q-img>
      <p class="pli-text col-9">El dueto del pueblo - Me Importa Un Culo | Video Oficial</p>
      <!--DELETE ICON-->
      <a class="pli-delete text-black"> <q-icon name="fas fa-times"/></a>
    </div>
</template>

<script>
export default {
  name: 'NavLink'
}
</script>

<style>

.pli-img {
  height: 80px !important;
}

.pli-text {
  padding: 0 8px;
  font-family: 'Inter', sans-serif;
  color: white;
}

.pli-delete {
  position: absolute;
  left: 0.8rem;
  width: 1.5rem;
  height: 1.8rem;
  font-size: 1.4rem;
  background-color: #FF9800;
  cursor: pointer;
}
</style>
