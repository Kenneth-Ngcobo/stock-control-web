<template>
    <b-container fluid>
      <h5 class="title">
        Welcome to Figment Manufacturing Stock Sytem
      </h5>

      <b-row class="mt-5">
        <b-col></b-col>
        <b-col sm="10" md="6" lg="4" class="pb-2 text-center">
          <b-button variant="outline-primary" size="lg" href="/register" style="width:150px;">Register</b-button>
          <b-button variant="outline-primary" size="lg" href="/login" style="width:150px;" class="ml-2">Login</b-button>
        </b-col>
        <b-col></b-col>
      </b-row>

      

    </b-container>
 
</template>

<script>

import {mapGetters} from 'vuex'

export default {
  computed: {
      ...mapGetters({
          isLoggedIn: 'user/isLoggedIn'
      })
  },
}
</script>

<style scoped>
.title {
  font-family:
    'Quicksand',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  display: block;
  font-weight: 300;
  font-size: 50px;
  color: #35495e;
  letter-spacing: 1px;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 50px;
}


</style>
