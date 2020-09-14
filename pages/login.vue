<template>
  <div>
    <div v-if="submitted">
     
    </div>

    <div v-if="!submitted">
    <h3>Login</h3>
    <form @submit.prevent="submitForm" class="my-form">
      <div class="form-group">
        <!--label for>Enter username</label-->
        <input type="text" v-model="userInfo.username" placeholder="Enter username" />
      </div>
      <div class="form-group">
        <!--label for>Enter password</label-->
        <input :type="showPassword ? 'text' : 'password'" v-model="userInfo.password" placeholder="Enter password" />
      </div>
      <input type="checkbox" @click="showPassword = !showPassword">
      <span>Show Password</span>
      <b-row>
        <b-col></b-col>
        <b-col><button type="submit">Login</button></b-col>
      </b-row>
       
      
    </form>
    </div>
    
    
  </div>
</template>

<script>
//import axios from "axios";

export default {
  name: "login",

  data: function() {
    return {
      userInfo: {
        username: "kenneth",
        password: "ken123"
      },
      submitted: false,
      showPassword: false
    };
  },

  methods: {
     
    async submitForm() {
      console.log(this.userInfo);

      try {
        let response = await this.$auth.loginWith('local', { data: this.userInfo })
        console.log(response);
        if(response.hasOwnProperty('data'))
        {
          if(response.data.hasOwnProperty('type'))
          {
            if(response.data.type == 'OK')
            {
              if(response.data.hasOwnProperty('user') && (JSON.stringify(response.data.user) !== '{}'))
              {
                console.log('Login user data =',response.data.user);
                await this.$auth.setUser(response.data.user);
                this.$router.push("/jobs")
              }
            }
            
          }
          
        }
        
      } catch (err) {
        console.log(err)
      }

      

     /* const { data } = await this.$axios.$post("", this.userInfo)
      .then(this.$store.state.loggedIn = true);
      this.$store.state.token = data.jwt;
      //this.submitted = true;
      this.$store.state.username = data.user.username
      //console.log(this.$store.state.loggedIn);
      
      */
      
    } 
  }
};

/*this.submitted = true;
        this.$auth.loginWith('local', {
            data: this.userInfo
        }).then(() => this.$toast.success('Logged In!'))
        .catch(e => {
          console.log("error:", e)
        })
     
  }*/
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
  padding-bottom: 15px;
}

.my-form label {
  display: block;
}

.my-form input[type=text], input[type=password] {
  padding: 8px;
  width: 50%;
}

.my-form button {
  margin-left: 25%;
  
}

.my-form button:hover {
  background-color: cyan;
  
}

.my-form input[type=checkbox] {
  margin-left: 0%;
  
}


</style>