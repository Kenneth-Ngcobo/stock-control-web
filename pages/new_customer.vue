<template>
<div>
    
    <form action="" class="form-horizontal">
         <div class="form-group">
        <label class="control-label col-sm-2" for>Company Name:</label>
        <input type="text" v-model="customer.customer_name" />
      </div>
      <div class="form-group">
        <label class="control-label col-sm-2" for>Telephone:</label>
        <input type="text" v-model="customer.telephone" />
      </div>
      <div class="form-group">
        <label class="control-label col-sm-2" for>Address:</label>
        <!--input type="text" v-model="customer.address" /-->
        <textarea name="" id="" cols="25" rows="5" v-model="customer.address"></textarea>
      </div>
      <div class="form-group">
        <label class="control-label col-sm-2" for>Email:</label>
        <input type="text" v-model="customer.email" />
      </div>
      <div class="form-group">
        <label class="control-label col-sm-2" for>Contact Person 1:</label>
        <input type="text" v-model="customer.contact_person1" />
      </div>
      <div class="form-group">
        <label class="control-label col-sm-2" for>Email for contact 1:</label>
        <input type="text" v-model="customer.email1" />
      </div>
      <div class="form-group">
        <label class="control-label col-sm-2" for>Contact Person2:</label>
        <input type="text" v-model="customer.contact_person2" />
      </div>
      <div class="form-group">
        <label class="control-label col-sm-2" for>Email for contact 2:</label>
        <input type="text" v-model="customer.email2" />
      </div>
    <button v-on:click="addCustomer">Add Customer</button>
    </form>

    <div v-if="submitted || true">
        <h6>Customer successfully addded</h6>
        <nuxt-link to='/jobs/newjob2'>
            Go Back To Creating A Job
        </nuxt-link>
    </div>
</div>
</template>

<script>
export default {
   middleware: ['auth'],
  data: function() {
    return {
      //items: [],
      customer: {
        id: 0,
        customer_name: null,
        telephone: null,
        address: null,
        email: null,
        contact_person1: null,
        email1: null,
        contact_person2: null,
        email2: null,
      },
      submitted: false,
    };
  }, 
  methods: {
    async addCustomer() {
      await this.$axios
        .$post("/customers", this.customer)
        this.submitted = true;
    }
  }   
}
</script>

<style scoped>

.form-horizontal {
    margin-top: 15px;
}

input {
    width: 250px;
}


</style>