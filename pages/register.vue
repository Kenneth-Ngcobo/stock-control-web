<template>
  <div id="register">

    <span v-if="showMessage">
    <b-alert show :variant="message.type">{{message.text}}</b-alert>
    </span>

    <div v-if="!submitted">
      <h3>Register</h3>
    
      <form  @submit.prevent="submitForm" class="my-form">
        <div class="form-group">
          <!--label for>Enter username</label-->
           <validation-provider  rules="required" v-slot="{ errors }">
          <input type="text" v-model="userInfo.username" placeholder="Enter username" />
           <span>{{ errors[0] }}</span>
          </validation-provider>
        </div>
        <div class="form-group">
          <!--label for>Enter username</label-->
           <validation-provider  rules="required" v-slot="{ errors }">
          <input type="text" v-model="userInfo.name" placeholder="Enter Name" />
          <span>{{ errors[0] }}</span>
          </validation-provider>
        </div>
        <div class="form-group">
          <!--label for>Enter username</label-->
          <validation-provider  rules="required" v-slot="{ errors }">
          <input type="text" v-model="userInfo.surname" placeholder="Enter surname" />
          <span>{{ errors[0] }}</span>
          </validation-provider>
        </div>
        <div class="form-group">
          <!--label for>Enter password</label-->
          <validation-provider name="email" rules="required|email" v-slot="{ errors }">
          <input type="text" v-model="userInfo.email" placeholder="Enter email address" />
           <span>{{ errors[0] }}</span>
          </validation-provider>
        </div>
        <div class="form-group">
          <!--label for>Enter password</label-->
          <input :type="showPassword ? 'text' : 'password'" v-model="userInfo.password" placeholder="Enter password" />
        </div>
        <div class="form-group">
          <!--label for>Enter password</label-->
          <input :type="showPassword ? 'text' : 'password'" v-model="userInfo.confirmPass" placeholder="Confirm password" />
        </div>
          
          <b-button variant="outline-primary" href="/" style="width:130px;" >Go Home</b-button>
          <b-button type="submit" variant="outline-primary" style="width:130px;" class="ml-2">Register</b-button>
      </form>
    </div>

    <div v-if="submitted">
      <b-button variant="outline-primary" href="/login" style="width:130px; margin-left: 50%" >Login</b-button>
    </div>
    <!--div style="margin-left:50%">
      <input type="checkbox" @click="showPassword = !showPassword">
        <span>Show Password</span>
    </div-->
    
  </div>
</template>

<script>
import { ValidationProvider, extend } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';

// No message specified.
extend('email', {
    ...email,
    message: 'Please enter a valid email'
    });

// Override the default message.
extend('required', {
  ...required,
  message: 'This field is required'
});

export default {
name: "register",
components: {
    ValidationProvider
  },
computed:{
  showMessage(){
    return (this.message.hasOwnProperty('text') && (this.message.text.trim() !== '')) ? true : false;
  }
},
data: function() {
    return {
      userInfo: {
        username: "",
        name: "",
        surname: "",
        role: "",
        email: "",
        password: "",
        confirmPass: ""
      },
      message: {
        text: '',
        type: 'danger'
      },
      showPassword: false,
      submitted: false,
     
    };
  },

 

methods: {
   async submitForm() {
      //console.log("submitForm");
      this.message.type = 'danger';
      this.message.text = '';

      let res = await this.$axios.$post('/register', this.userInfo);
      console.log(res);
      if(res.hasOwnProperty('type'))
      {
        this.message.text = res.message || ''; 
        if(res.type == 'OK')
        {
          this.message.type = 'success';
          this.message.text = 'You have successfully registered, please wait to be authorized to use the system';
          this.submitted = true;
        }
      }
      
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