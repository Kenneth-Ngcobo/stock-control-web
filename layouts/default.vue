<template>
  <div class="container-fluid">
    <div class="row" style="background-color:lightgreen;">
      <AppHeader class="nav justify-content-start col-sm-6 appHeader" />
      <nav v-if="isLoggedIn" class="nav justify-content-end nav-pills col-sm-6">
          <a class="nav-link" v-if="isAdmin"  href="/register" data-toggle="pills">Register</a>
          <a class="nav-link"  @click="Logout"  href="/login" data-toggle="pills">Logout</a>
      </nav>
    </div>
    <Nuxt />
  </div>
</template>

<script>
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
    }
  }
};
</script>

<style>
.nav-link {
  color: rgb(7, 7, 7);
}
</style>
