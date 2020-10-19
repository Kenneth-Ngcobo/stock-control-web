<template>
<div>
   
     <h3>{{bom.bom_name}} BOM</h3>
     <div>Last Modified: {{bom.date_created}}</div>
     <div>BOM Cost: R{{bom_price.toFixed(2)}}</div>
     <table class="table table-bordered" style="width:60%">
          <thead>
            <tr>
            <th>Type</th>
            <th>Item</th>
            <th>Description</th>
            <th>Designator</th>
            <th>Qty</th>
            <th>Unit Cost</th>
            <th>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in components"
            v-bind:key="item.index">
            <td>{{item.type}}</td>
            <td>{{item.comp_name}}</td>
            <td>{{item.description}}</td>
            <td>{{item.designator}}</td>
            <td>{{item.qty}}</td>
            <td v-text="findItem(item.comp_id).price"></td>
            <td v-text="findItem(item.comp_id).price*item.qty"></td>
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
            bom: [],
            id: this.$route.params.idbom,
            components: [],
            items: [],
            actual_items: [],
            product: [],
            bom_price: 0
        };
  }, 
  methods: {
        findItem(comp_id){

            return this.items.find(v => v.id == comp_id) || {}
        },
       
  },

  created: async function() {
   let bom = await this.$axios.$get(`/bom_list/`)
      this.bom = bom.find(v => v.idbom == this.$route.params.idbom);
  

    //this.componentsArray = JSON.parse(this.bom.components)
   let components = await this.$axios.$get(`/bom/${this.bom.bom_name}`)
            this.components = components;
            console.log(this.bom.bom_name)
            //console.log(this.bom)
       
    let items = await this.$axios.$get("/fig_items")
      this.items = items;

   for (let i = 0; i<this.components.length; i++) {
            for(let j = 0; j<this.items.length; j++) {
                if (this.components[i].comp_name == this.items[j].part_number) {
                    this.actual_items[i] = this.items[j]
                    //console.log(this.items[j].id)
                }
                /*
                else {
                  this.actual_items[i] = this.components[i]
                }*/
            } 
        } 
    //debugger
    for(let i = 0; i<this.components.length; i++) {
      this.product[i] = this.components[i].qty*this.actual_items[i].price
      this.bom_price = (this.bom_price+this.product[i])
    }

    

    },
  
}
</script>

<style scoped>

td {
  height: 3px;
  
}

</style>