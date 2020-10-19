<template>

<span v-if="isLoggedIn"> <!--class="nav justify-content-start nav-pills cstm-class"-->

<div id="mySidenav" class="sidenav">
  <a href="javascript:void(0)" class="closebtn" @click="closeNav()">&times;</a>
  <a href="/jobs">Jobs</a>
  <a href="#">Services</a>
  <a href="#">Clients</a>
  <a href="#">Contact</a>
</div>

<!-- Use any element to open the sidenav -->
<span @click="openNav()">
    <i style="padding:10px;" class="fa fa-bars"></i>
</span>

<!-- Add all page content inside this div if you want the side nav to push page content to the right (not used if you only want the sidenav to sit on top of the page -->
<span id="main">

  
</span>


     <span id="Home">
        <nuxt-link class="nav-link" to='/home'>Home</nuxt-link>
    </span>

    <span>
       <nuxt-link class="nav-link" to='/jobs'>Jobs</nuxt-link>
   </span>

    <span id="Home">
        <nuxt-link class="nav-link" to='/components'>The Store </nuxt-link>
    </span>

     <span>
       <nuxt-link class="nav-link" to='/boms'>BOMs</nuxt-link>
    </span>

    <span>
       <nuxt-link class="nav-link" to='/pos'>POs</nuxt-link>
   </span>

    <!--span id="addProduct">
        <nuxt-link v-if="isAdmin" class="nav-link"  to='/components/additem'>Add Item</nuxt-link>
    </span-->

     <span id="validateUsers">
        <nuxt-link v-if="isAdmin" class="nav-link"  to='/authorize'>Authorize Users</nuxt-link>
    </span>

    <span>
        
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
   },
   methods: {
        openNav() {
            document.getElementById("mySidenav").style.width = "250px";
        },

/* Set the width of the side navigation to 0 */
        closeNav() {
            document.getElementById("mySidenav").style.width = "0";
        }
   }
}
</script>

<style scoped>

/* The side navigation menu */
.sidenav {
  height: 100%; /* 100% Full-height */
  width: 0; /* 0 width - change this with JavaScript */
  position: fixed; /* Stay in place */
  z-index: 1; /* Stay on top */
  top: 0; /* Stay at the top */
  left: 0;
  background-color: lightgreen; /* Black*/
  overflow-x: hidden; /* Disable horizontal scroll */
  padding-top: 60px; /* Place content 60px from the top */
  transition: 0.5s; /* 0.5 second transition effect to slide in the sidenav */
}

/* The navigation menu links */
.sidenav a {
  padding: 8px 8px 8px 32px;
  text-decoration: none;
  font-size: 25px;
  color: black;
  display: block;
  transition: 0.3s;
}

/* When you mouse over the navigation links, change their color */
.sidenav a:hover {
  color: #f1f1f1;
}

/* Position and style the close button (top right corner) */
.sidenav .closebtn {
  position: absolute;
  top: 0;
  right: 25px;
  font-size: 36px;
  margin-left: 50px;
}

/* Style page content - use this if you want to push the page content to the right when you open the side navigation */
#main {
  transition: margin-left .5s;
  padding: 20px;
}

/* On smaller screens, where height is less than 450px, change the style of the sidenav (less padding and a smaller font size) */
@media screen and (max-height: 450px) {
  .sidenav {padding-top: 15px;}
  .sidenav a {font-size: 18px;}
}

</style>