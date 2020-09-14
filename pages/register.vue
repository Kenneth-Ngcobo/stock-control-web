<template>
  <div>
    <h3>Register</h3>
    <form v-if="!submitted" @submit.prevent="submitForm" class="my-form">
      <div class="form-group">
        <!--label for>Enter username</label-->
        <input type="text" v-model="userInfo.username" placeholder="Enter username" />
      </div>
      <div class="form-group">
        <!--label for>Enter password</label-->
        <input type="text" v-model="userInfo.email" placeholder="Enter email address" />
      </div>
      <div class="form-group">
        <!--label for>Enter password</label-->
        <input type="text" v-model="userInfo.password" placeholder="Enter password" />
      </div>
      
        <button>Login</button>
    </form>
    <div v-if="submitted">
      <h3>Thanks for adding a product</h3>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['auth'],
name: "login",

data: function() {
    return {
      userInfo: {
        username: "",
        email: "",
        password: "",
    },
      submitted: false
    };
  },

methods: {
    submitForm() {
      /*
        this.submitted = true;
        this.$auth.loginWith('local', {
            data: this.userInfo
        })
      //alert('You pressed a button')*/
    } 
  }

}

</script>

<style scoped>
.my-form {
  margin-left: 30%;
 
}
h3 {
  margin-left: 30%;
  margin-top: 50px;
}
.my-form .form-group {
  padding-bottom:15px;
}

.my-form label{
  display:block;
  
}

.my-form input{
  padding:8px;
  width:50%;
}
</style>