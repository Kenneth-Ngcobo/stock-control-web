<template>
  <div>
    <div>

    <input type="text" placeholder="Search items" v-model="filter" />
    <nuxt-link to='/components/additem'>
    <button>Add Item</button>
    </nuxt-link>
    <table class="table table-bordered table-hover grid">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Part Number</th>
          <th scope="col">Description</th>
          <th scope="col">Comment</th>
          <th class="small-col" scope="col">Sub Cat</th>
          <th scope="col">Price</th>
          <th scope="col">Qty</th>
          <th scope="col">Bin</th>
          <th scope="col">Supplier</th>
          <th scope="col">Mfg Part#</th>
          <th scope="col">Lead-time</th>
        </tr>
      </thead>
      <tbody>
        <tr
        v-for="item in filteredItems"
        v-bind:key="item.id"
        >
          <td scope="row">{{item.id}}</td>
          <td><nuxt-link :to="`/components/${item.id}`">{{item.part_number}}</nuxt-link></td>
          <td>{{item.description}}</td>
          <td>{{item.comment}}</td>
          <td class="small-col">{{item.sub_category}}</td>
          <td>{{item.price}}</td>
          <td>{{item.qty}}</td>
          <td>{{item.bin_location}}</td>
          <td>{{item.vendor}}</td>
          <td class="small-col"></td>
          <td>{{item.lead_time}}</td>
        </tr>
      </tbody>
    </table>
    </div>
  </div>
</template>

<script> 
//import axios from "axios";
export default {
   middleware: ['auth'],
  data() {
    return {
      items: [],
      filter: '',
      //filteredItems: []
    };
  },

  computed: {
      filteredItems() {

        //console.log('From filtered items', this.items)
        
        return this.items.filter(item => {
        const part = item.part_number.toString().toLowerCase();
        const description = item.description.toLowerCase();
        //const subcat = item.sub_category.toLowerCase();
        const searchTerm = this.filter.toLowerCase();

        return part.includes(searchTerm) ||
        description.includes(searchTerm) 
        //subcat.includes(searchTerm);
      });
  }
  },

  created: async function() {
    this.items = await this.$axios.$get("/fig_items")

    //await this.filteredItems();
    
  
  },

};
</script>

<style scoped>

input {
  margin-top: 10px;
  width: 300px;
}

.table {
  margin-top: 10px;
}

td {
  font-size: small;
}

.small-col {
  column-width: 150px;
  overflow-wrap: inherit;
}

</style>