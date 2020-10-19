<template>
  <div class="addItem">
    <h3 v-if="!submitted" style="margin-left: 30px;">Add Item</h3>
    <div v-if="!submitted" > <!--style="display:flex"--->

    <div class="col-md-6 float-left">
    <form  class="form-horizontal" > <!---style="width:50%; margin:auto;"---->
      <div class="form-group">
        <label class="control-label col-sm-4" for>Part number:</label>
        <input type="text" v-model="item.part_number" />
      </div>
      <div class="form-group">
        <label class="control-label col-sm-4" for>Description:</label>
        <input type="text" v-model="item.description" />
      </div>
      <div class="form-group">
        <label class="control-label col-sm-4" for>Item category:</label>
        <input list="category" v-model="item.category" />
      </div>
      <datalist id="category">
          <option v-for="option in item_options" :key="option.option_id">{{option.category}}</option>
      </datalist>

      <div class="form-group">
        <label class="control-label col-sm-4" for>Sub category:</label>
        <input list="sub_cat" v-model="item.sub_category" />
      </div>
      <datalist id="sub_cat">
          <option v-for="option in item_options" :key="option.option_id">{{option.sub_category}}</option>
      </datalist>

      <div class="form-group">
        <label class="control-label col-sm-4" for>Price:</label>
        <input type="text" v-model="item.price" />
      </div>
      <div class="form-group">
        <label class="control-label col-sm-4" for>Quantity:</label>
        <input type="text" v-model="item.qty" />
      </div>
      <div class="form-group">
        <label class="control-label col-sm-4" for>Comment:</label>
        <input type="text" v-model="item.comment" />
      </div>
      <div class="form-group">
        <label class="control-label col-sm-4" for>Bin location:</label>
        <input type="text" v-model="item.bin_location" />
      </div>
    </form>
    </div>

    <div class="col-md-6 float-right">
    <form class="form-horizontal" > <!---style="width:50%; margin:auto;"--->
      <div class="form-group">
        <label class="control-label col-sm-4" for>Supplier:</label>
        <input list="supplier" v-model="item.vendor" />
      </div>

      <datalist id="supplier">
          <option v-for="option in item_options" :key="option.option_id">{{option.suppliers}}</option>
      </datalist>

      <div class="form-group">
        <label class="control-label col-sm-4" for>Supplier Part No:</label>
        <input type="text" v-model="item.vendor_item_number" />
      </div>
      <div class="form-group">
        <label class="control-label col-sm-4" for>Lead-time:</label>
        <input type="text" v-model="item.lead_time" />
      </div>
      <div class="form-group">
        <label class="control-label col-sm-4" for>MFG Name:</label>
        <input list="mfg_name" v-model="item.mfg_name" />
      </div>

      <datalist id="mfg_name">
          <option v-for="option in item_options" :key="option.option_id">{{option.mfg_name}}</option>
      </datalist>
 
      <div class="form-group">
        <label class="control-label col-sm-4" for>MFG Part Number:</label>
        <input type="text" v-model="item.mfg_partnumber" />
      </div>
      <div class="form-group">
        <label class="control-label col-sm-4" for>Mounting type:</label>
        <input list="mounting-type" v-model="item.mounting_type" />
      </div>
      <datalist id="mounting-type">
          <option v-for="option in item_options" :key="option.option_id">{{option.mounting_type}}</option>
      </datalist>

      <div class="form-group">
        <label class="control-label col-sm-4" for>Package:</label>
        <input list="package" v-model="item.package" />
      </div>
      <datalist id="package">
          <option v-for="option in item_options" :key="option.option_id">{{option.package}}</option>
      </datalist>

      <!--div class="form-group">
        <label class="control-label col-sm-4" for>Footprint Ref:</label>
        <input type="text" v-model="item.footprint_ref" />
      </div>
      <div class="form-group">
        <label class="control-label col-sm-4" for>Library Ref:</label>
        <input type="text" v-model="item.library_ref" />
      </div-->
    </form>
    
    </div> <!-- END OF RIGHT FLOAT -->

    </div> <!-- END OF IF SUBMITTED -->

    <button v-on:click="addItem">Submit</button>
    <div v-if="submitted">
      <h3>Component succeffuly added</h3>
      <nuxt-link to='/components'><button>Go Back To Items List</button></nuxt-link>
    </div>
   
  </div>
</template>

<script>
//`import axios from "axios";

export default {
  middleware: ['auth'],
  data: function() {
    return {
      item_options: [],
      item: {
        id: 0,
        part_number: null,
        description: null,
        category: null,
        sub_category: null,
        price: null,
        qty: null,
        comment: null,
        bin_location: null,
        vendor: null,
        vendor_item_number: null,
        lead_time: null,
        mfg_name: null,
        mfg_partnumber: null,
        mounting_type: null,
        package: null,
        footprint_ref: null,
        library_ref: null
      },
      submitted: false,
    };
  },

  methods: {
    async addItem() {
      await this.$axios
        .$post("/fig_items", this.item)
        this.submitted = true;
    }
  },
  created: async function() {
    this.item_options = await this.$axios.$get("/item_options")
  }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.addItem {
  margin-left: 0%;
  margin-top: 10px;
}
h3 {
  margin-left: 1%;
}
.my-form {
  padding: 10px;
}

.my-form .form-group {
  padding-bottom: 15px;
}

.my-form label {
  display: inline;
}

.form-horizontal input[type=text][type=list] {
  padding: 1px;
  margin-left: 20px;
  width: 45%;
}

button {
  margin-left: 0%;
  margin-top: 50px;
  width: 10%;
}

button:hover {
  background-color: green;
}


</style>