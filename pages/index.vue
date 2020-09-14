<template>
    <div>
      <h5 class="title">
        Figment Manufacturing Stock and Job System
      </h5>

      <!--h5>loggedIn: {{$auth.loggedIn}}</h5>
      <h5>user: {{$auth.user}}</h5>
      <h5>isLoggedIn: {{isLoggedIn}}</h5-->
      <div class="row">
      <nuxt-link class="nav-link" to='/components'>
        <button>Store</button>
      </nuxt-link>
      <nuxt-link class="nav-link" to='/jobs'>
      <button>Jobs</Center></button>
       </nuxt-link>
       </div>
       <div class="row">
       <nuxt-link class="nav-link" to='/pos'>
      <button>POs</button>
       </nuxt-link>
        <nuxt-link class="nav-link" to='/boms'>
      <button>BOMs</button>
       </nuxt-link>
       </div>
     
    </div>
 
</template>

<script>

import {mapGetters} from 'vuex'

export default {
  middleware: ['auth'],
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

button {
  padding: 60px 60px;
  margin-top: 50px;
  margin-left:300px;
 
}

</style>
