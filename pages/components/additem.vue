<template>
  <div class="addItem">
    <h3 v-if="!submitted">Add Item</h3>
    <div v-if="!submitted" style="display:flex">
    <form  class="form-horizontal" style="width:50%; margin:auto;">
      <div class="form-group">
        <label class="control-label col-sm-3" for>Part number:</label>
        <input type="text" v-model="item.part_number" />
      </div>
      <div class="form-group">
        <label class="control-label col-sm-3" for>Description:</label>
        <input type="text" v-model="item.description" />
      </div>
      <div class="form-group">
        <label class="control-label col-sm-3" for>Item category:</label>
        <input type="text" v-model="item.category" />
      </div>
      <div class="form-group">
        <label class="control-label col-sm-3" for>Sub category:</label>
        <input type="text" v-model="item.sub_category" />
      </div>
      <div class="form-group">
        <label class="control-label col-sm-3" for>Price:</label>
        <input type="text" v-model="item.price" />
      </div>
      <div class="form-group">
        <label class="control-label col-sm-3" for>Quantity:</label>
        <input type="text" v-model="item.qty" />
      </div>
      <div class="form-group">
        <label class="control-label col-sm-3" for>Comment:</label>
        <input type="text" v-model="item.comment" />
      </div>
      <div class="form-group">
        <label class="control-label col-sm-3" for>Bin location:</label>
        <input type="text" v-model="item.bin_location" />
      </div>
    </form>

    <form class="form-horizontal" style="width:50%; margin:auto;">
      <div class="form-group">
        <label class="control-label col-sm-3" for>Supplier:</label>
        <input type="text" v-model="item.vendor" />
      </div>
      <div class="form-group">
        <label class="control-label col-sm-3" for>Supplier Part No:</label>
        <input type="text" v-model="item.vendor_item_number" />
      </div>
      <div class="form-group">
        <label class="control-label col-sm-3" for>Lead-time:</label>
        <input type="text" v-model="item.lead_time" />
      </div>
      <div class="form-group">
        <label class="control-label col-sm-3" for>MFG Name:</label>
        <input type="text" v-model="item.mfg_name" />
      </div>
      <div class="form-group">
        <label class="control-label col-sm-3" for>MFG Part Number:</label>
        <input type="text" v-model="item.mfg_partnumber" />
      </div>
      <div class="form-group">
        <label class="control-label col-sm-3" for>Mounting type:</label>
        <input type="text" v-model="item.mounting_type" />
      </div>
      <div class="form-group">
        <label class="control-label col-sm-3" for>Package:</label>
        <input type="text" v-model="item.package" />
      </div>
      <div class="form-group">
        <label class="control-label col-sm-3" for>Footprint Ref:</label>
        <input type="text" v-model="item.footprint_ref" />
      </div>
      <div class="form-group">
        <label class="control-label col-sm-3" for>Library Ref:</label>
        <input type="text" v-model="item.library_ref" />
      </div>
    </form>
    </div>
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
  
  data: function() {
    return {
      //items: [],
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

.form-horizontal input {
  padding: 1px;
  width: 45%;
}

button {
  margin-left: 40%;
  width: 10%
}

button:hover {
  background-color: green;
}


</style>