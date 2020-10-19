<template>
    <div>
        <h5 style="margin-left: 27px;"> {{item.part_number}} </h5>
        <div > <!----style="display:flex"---->
        <div class="col-md-6 float-left"> 
        <form class="form-horizontal" > <!---style="width:50%; margin:auto;"---->
            <div class="form-group">
                <label class="control-label col-sm-3">Part Number:</label>
                <input type="text" :class="{'read-only' : !edit }" v-model="item.part_number" :readonly="!edit" >
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Description:</label>
                <input type="text" :class="{'read-only' : !edit }" v-model="item.description" :readonly="!edit">
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Sub Cat:</label>
                <input type="text" :class="{'read-only' : !edit }" v-model="item.sub_category" :readonly="!edit" >
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Price:</label>
                <input type="text" :class="{'read-only' : !edit }" v-model="item.price" :readonly="!edit">
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Qty:</label>
                <input type="text" :class="{'read-only' : !edit }" v-model="item.qty" :readonly="!edit">
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Bin:</label>
                <input type="text" :class="{'read-only' : !edit }" v-model="item.bin_location" :readonly="!edit">
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Supplier:</label>
                <input type="text" :class="{'read-only' : !edit }" v-model="item.vendor" :readonly="!edit">
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Supplier Part No:</label>
                <input type="text" :class="{'read-only' : !edit }" v-model="item.vendor_item_number" :readonly="!edit">
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Lead-time:</label>
                <input type="text" :class="{'read-only' : !edit }" v-model="item.lead_time" :readonly="!edit">
            </div>
            <div v-if="!edit">
            <button @click.prevent="edit = true">Edit</button>
            </div>
            <div v-else>
            <button @click="updateItem">Update</button>
            </div>
        </form>
        </div>

        <div class="col-md-6 float-right">
        <form class="form-horizontal" > <!----style="width:50%; margin:auto;"---->
            <div class="form-group">
                <label class="control-label col-sm-3">Mfg Name:</label>
                <input type="text" :class="{'read-only' : !edit }" v-model="item.mfg_name" :readonly="!edit" >
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Mfg Partnumber:</label>
                <input type="text" :class="{'read-only' : !edit }" v-model="item.mfg_partnumber" :readonly="!edit">
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Mounting type:</label>
                <input type="text" :class="{'read-only' : !edit }" v-model="item.mounting_type" :readonly="!edit">
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Package:</label>
                <input type="text" :class="{'read-only' : !edit }" v-model="item.package" :readonly="!edit">
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Comment:</label>
                <input type="text" :class="{'read-only' : !edit }" v-model="item.comment" :readonly="!edit">
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Category:</label>
                <input type="text" :class="{'read-only' : !edit }" v-model="item.category" :readonly="!edit">
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Footprint Ref:</label>
                <input type="text" :class="{'read-only' : !edit }" v-model="item.footprint_ref" :readonly="!edit">
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Library Ref:</label>
                <input type="text" :class="{'read-only' : !edit }" v-model="item.library_ref" :readonly="!edit" >
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Date Modified:</label>
                <input type="text" :class="{'read-only' : !edit }" v-model="item.date_modified" :readonly="!edit">
            </div>
            
        </form>
         </div>



        </div>
    </div>
</template>

<script>
//import axios from "axios";
    export default {
        middleware: ['auth'],
        data() {
            return {
                item: {},
                id: this.$route.params.id,
                edit: false,
                comp: {
                    part_number: "",
                    description: "",
                    sub_category: "",
                    price: "",
                    qty: "",
                    bin_location: "",
                    vendor: "",
                    vendor_item_number: "",
                    lead_time: "",
                    mfg_name: "",
                    mfg_partnumber: "",
                    mounting_type: "",
                    package: "",
                    comment: "",
                    category: "",
                    footprint_ref: "",
                    library_ref: "",
                    date_modified: "" 
                }
    };
  },

  methods: {
        updateItem () {
            this.$axios.$post('/fig_items_update', this.item)
            //console.log(this.item)
            this.edit = false
        }
  },

  created: async function() {
    let item = await this.$axios.$get(`/fig_items/`)
      this.item = item.find(v => v.id == this.$route.params.id);
    
    //console.log(this.item)
  },
  
}
</script>


<style scoped>

h5 {
    margin-left: 10px;
    font-weight: bold;
    margin-top: 10px;
    
}
.my-form {
    margin-left: 10px;
}

.form-group {
    font-size: small;
}

.my-form label {
    display: block;
}
.form-horizontal input[type=text] {
    width: 50%;
   
}

button {
  margin-left: 80%;
  margin-top: 20px;
 
}

button:hover {
  background-color: green;
}

.read-only {
    background-color: rgb(231, 226, 226);
}

</style>