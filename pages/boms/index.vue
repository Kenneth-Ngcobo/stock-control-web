<template>
<div>
    <div>
    Welcome to BOMs
  </div>
   <nuxt-link class="nav-link" to='/boms/newbom'>
   <button>New BOM</button>
   </nuxt-link>

  <table class="table table-bordered table-hover grid" style="width:60%">
      <thead>
        <tr>
          <th scope="col">BOM ID</th>
          <th scope="col">BOM Name</th>
          <th scope="col">Description</th>
          <th scope="col">Customer</th>
          <th scope="col">Cost</th>
        </tr>
      </thead>
      <tbody>
        <tr
        v-for="bom in boms"
        v-bind:key="bom.idbom"
        >
          <td>{{bom.idbom}}</td>
          <td><nuxt-link :to="`/boms/${bom.idbom}`">{{bom.bom_name}}</nuxt-link></td>
          <td>{{bom.description}}</td>
          <td>{{bom.customer}}</td>
          <td>{{""}}</td>
        </tr>
      </tbody>
    </table>

</div>
</template>

<script>
//import axios from "axios";

export default {
  middleware: ['auth'],
    data() {
    return {
      boms: [],
     
    };
  },

  created: async function() {
    let boms = await this.$axios.$get("/bom_list")
      this.boms = boms;

  }
        
}
</script>

<style scoped>

</style>