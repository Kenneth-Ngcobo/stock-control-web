<template>
    <div>
        <h5> {{item.part_number}} </h5>
        <div style="display:flex">
        <form class="form-horizontal" style="width:50%; margin:auto;">
            <div class="form-group">
                <label class="control-label col-sm-2">Part Number:</label>
                <input type="text" readonly :value="item.part_number">
            </div>
            <div class="form-group">
                <label class="control-label col-sm-2">Description:</label>
                <input type="text" readonly :value="item.description">
            </div>
            <div class="form-group">
                <label class="control-label col-sm-2">Sub Cat:</label>
                <input type="text" readonly :value="item.sub_category">
            </div>
            <div class="form-group">
                <label class="control-label col-sm-2">Price:</label>
                <input type="text" readonly :value="item.price">
            </div>
            <div class="form-group">
                <label class="control-label col-sm-2">Qty:</label>
                <input type="text" readonly :value="item.qty">
            </div>
            <div class="form-group">
                <label class="control-label col-sm-2">Bin:</label>
                <input type="text" readonly :value="item.bin_location">
            </div>
            <div class="form-group">
                <label class="control-label col-sm-2">Supplier:</label>
                <input type="text" readonly :value="item.vendor">
            </div>
            <div class="form-group">
                <label class="control-label col-sm-2">Supplier Part No:</label>
                <input type="text" readonly :value="item.vendor_item_number">
            </div>
            <div class="form-group">
                <label class="control-label col-sm-2">Lead-time:</label>
                <input type="text" readonly :value="item.lead_time">
            </div>
            <button @click="edit = !edit">Edit</button>
        </form>

        <form class="form-horizontal" style="width:50%; margin:auto;">
            <div class="form-group">
                <label class="control-label col-sm-2">Mfg Name:</label>
                <input type="text" readonly :value="item.mfg_name">
            </div>
            <div class="form-group">
                <label class="control-label col-sm-2">Mfg Partnumber:</label>
                <input type="text" readonly :value="item.mfg_partnumber">
            </div>
            <div class="form-group">
                <label class="control-label col-sm-2">Mounting type:</label>
                <input type="text" readonly :value="item.mounting_type">
            </div>
            <div class="form-group">
                <label class="control-label col-sm-2">Package:</label>
                <input type="text" readonly :value="item.package">
            </div>
            <div class="form-group">
                <label class="control-label col-sm-2">Comment:</label>
                <input type="text" readonly :value="item.comment">
            </div>
            <div class="form-group">
                <label class="control-label col-sm-2">Category:</label>
                <input type="text" readonly :value="item.category">
            </div>
            <div class="form-group">
                <label class="control-label col-sm-2">Footprint Ref:</label>
                <input type="text" readonly :value="item.footprint_ref">
            </div>
            <div class="form-group">
                <label class="control-label col-sm-2">Library Ref:</label>
                <input type="text" readonly :value="item.library_ref">
            </div>
            <div class="form-group">
                <label class="control-label col-sm-2">Date Modified:</label>
                <input type="text" readonly :value="item.date_modified">
            </div>
            
        </form>




        </div>
    </div>
</template>

<script>
//import axios from "axios";
    export default {
        data() {
            return {
                item: [],
                id: this.$route.params.id,
                edit: false
    };
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
    background-color: lightgrey;
}

button {
  margin-left: 80%;
  margin-top: 20px;
  width: 10%
}

button:hover {
  background-color: green;
}



</style>