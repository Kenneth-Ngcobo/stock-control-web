<template>
  <div class="container-fluid">
    <div class="row" style="background-color:lightgreen;">
      <AppHeader class="nav justify-content-start col-sm-6 appHeader" />
      <nav v-if="isLoggedIn" class="nav justify-content-end nav-pills col-sm-6">
         <h6>Logged in: {{$auth.user.username}}</h6>
          <a class="nav-link"  @click.prevent="Logout"  href="#" data-toggle="pills">Logout</a>
      </nav>
    </div>
    <Nuxt />
  </div>
</template>

<script>
import '@fortawesome/fontawesome-free/css/brands.css';
import '@fortawesome/fontawesome-free/css/regular.css';
import '@fortawesome/fontawesome-free/css/solid.css';
import '@fortawesome/fontawesome-free/css/fontawesome.css';


import AppHeader from "../components/AppHeader";
import {mapGetters} from 'vuex'

export default {
  components: {
    AppHeader
  },
  computed: {
      ...mapGetters({
        isLoggedIn: 'user/isLoggedIn',
        isAdmin: 'user/isAdmin'
      })
  },
  methods: {
    async Logout() {
      //this.$store.state.token = null;
      await this.$auth.logout();
      window.localStorage.currentUser = JSON.stringify({})
      this.$router.push("/");
    }
  },
  mounted(){
    console.log('type of default window.localStorage.currentUser =',typeof window.localStorage.currentUser)
    if(JSON.parse(window.localStorage.currentUser).hasOwnProperty('username')) { 
    this.$auth.setUser(JSON.parse(window.localStorage.currentUser))
    }
  }
};
</script>

<style>
@media (min-width: 576px)
{
  .form-inline label {
      display: inline-block;
      align-items: center;
      justify-content: center;
      margin-bottom: 0;
  }
}
.VueTables__limit-field {
  margin-left: 10px;
}

.nav-link {
  color: rgb(7, 7, 7);
}

h6 {
  margin-top: 10px;
}

.dropdown-item {
  margin-left: 20px;
}

a.dropdown-item {
  margin-left: 10px;

}

.form-control {
  margin-left: 5px;
}

a.page-link {
  margin: 0px 0px 0px -1px;
  padding: 8px 12px;
}
</style>
