<template>

<span v-if="isLoggedIn"> <!--class="nav justify-content-start nav-pills cstm-class"-->
    <span id="Home">
        <nuxt-link class="nav-link" to='/'>Home</nuxt-link>
    </span>
    <span id="Home">
        <nuxt-link class="nav-link" to='/components'>The Store </nuxt-link>
    </span>
   
    <span id="addProduct">
        <nuxt-link v-if="isAdmin" class="nav-link"  to='/components/additem'>Add Item</nuxt-link>
    </span>
     
</span>

</template>

<script>
import {mapGetters} from 'vuex'
export default {
   name: 'AppHeader',
   computed: {
       ...mapGetters({
           isLoggedIn: 'user/isLoggedIn',
           isAdmin: 'user/isAdmin'
       })
   }
}
</script>

<style scoped>

</style>