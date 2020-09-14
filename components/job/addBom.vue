<template>
    <div>
        <div> <!-----IF JOB CAT IS NOT NEW--------->
        <label for="">Add BOM to order</label>
        <input list="bom" autocomplete="off" v-model="bom" @blur="pushOrder($event)">
       
        <datalist id="bom">
            <option v-for="bom in boms" :key="bom.idbom">{{bom.bom_name}}</option>
        </datalist>
        <input type="text" v-model="orderedItem.qty" placeholder="Qty">
         <button @click="addToOrder">Add</button> <!--@click="addFigItem"-->
    </div>

    </div>
</template>

<script>
    export default {

        data() {
            return {
            boms: [],
            orderedItems: [],
            selectedItem: {},
            orderedItem: {
                //id: "",
                name: "",
                qty: ""
            },
            finish: false
            }
        },

        methods: {

        pushOrder(event) {

            this.orderedItem.name = this.bom
            
        },
        
        addToOrder: function() {

            this.orderedItems.push(this.orderedItem);
            //console.log(this.orderedItem)
            
            
            this.orderedItem = {};
            //console.log(this.orderedItems)
            
        }, 
        
        removeItem: function(index) {
            this.orderedItems.splice(index, 1)
        },

        finishOrder: async function() {
        for(let i = 0; i<this.orderedItems.length; i++) {
            await this.$axios
                .$post("/ordered_boms",{
                    //ORDERED ITEMS is an array of objects, find a way to insert each object as a row in sql
                    id: 0,
                    bom_name: this.orderedItems[i].name,
                    qty: this.orderedItems[i].qty,
                    job_number: this.newJob.job_number
                    //orders_id: this.order.id // LAST_ID() + 1??

            })
        }
        let finishedNewOrder = await this.$axios.$get(`/ordered_boms/${this.newJob.job_number}`)
                this.finishedNewOrder = finishedNewOrder
                this.finish = true
               // console.log(this.finishedNewOrder)
    }

    },

    created: async function() {
        let boms = await this.$axios.$get("/bom_list")//.then(response => {
        this.boms = boms//response.data;
    }
}
</script>

<style lang="css" scoped>

</style>