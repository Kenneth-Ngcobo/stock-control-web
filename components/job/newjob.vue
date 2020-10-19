k<template>
<div>
    <div v-if="(!submitted && !finish)">
    <h3>Create a job</h3>
    <form class="form-horizontal">
    <div class="form-group">
        <label class="control-label col-sm-2" for>Select Customer:</label>
        <!--select name="Customers" v-model="order.customer">
            <option value="" disabled selected hidden>Select a customer</option>
            <option value="CUST1">CUST1</option>
            <option value="CUST2">CUST2</option>
            <option value="CUST3">CUST3</option>
            <option value="CUST4">CUST4</option>
            <option value="CUST5">CUST5</option> 
        </select-->
         <input list="customers" autocomplete="off" v-model="order.customer" placeholder="Select customer">
         <nuxt-link to='/new_customer'>
         <b-button>Add New Customer</b-button>
         </nuxt-link>
         <datalist id="customers">
            <option v-for="customer in customers" :key="customer.idcustomers">{{customer.customer_name}}</option>
        </datalist>
      </div>

      <div class="form-group">
        <label class="control-label col-sm-2" for>Requested delivery date:</label>
        <input type="date" v-model="order.req_del"/>
      </div>
      <!--SPECIFY JOB CATEGORY -->
      <div class="form-group">
        <label class="control-label col-sm-2" for>Select Job type:</label>
        <select name="Job type" v-model="order.job_cat">
            <option value="" disabled selected hidden>Select job cat</option>
            <option value="new">New</option>
            <option value="repeat">Repeat</option>
            <option value="repair">Repair</option>
            <option value="rework">Rework</option>
        </select>
       
      </div>
    </form>
    <b-button v-on:click.prevent="createOrder">Create Job</b-button>
    </div>
<!--------------------------------------------SELECT BOMS ORDERED ON THE JOB----------------------------------------------------------->
    <div v-if="(submitted && !finish)">
      <h3>Enter order items for job {{newJob.job_number}}</h3>

    <!-----------------------------IF JOB CAT IS NEW UPLOAD A BOM------------------------------------>
    <div v-if="order.job_cat == 'new'">
        <new-bom :newJob="newJob" @addBOM="addBOM()" @addAnother="addAnother()" :key="componentKey"></new-bom>
    </div>

    <br>

      <div v-if="order.job_cat == 'repeat'"> <!------------- IF JOB CAT IS NOT NEW ADD BOM TO ORDER --------->
        <label for="">Add BOM to order</label>
        <input list="bom" autocomplete="off" v-model="bom" @blur="pushOrder($event)">
       
        <datalist id="bom">
            <option v-for="bom in boms" :key="bom.idbom">{{bom.bom_name}}</option>
        </datalist>
        <input type="text" v-model="orderedItem.qty" placeholder="Qty">
         <button @click="addToOrder">Add</button> <!--@click="addFigItem"-->
    </div>


    <!--PREVIEW TABLE FOR SELECTED ITEMS -->
        <div id="preview" v-if="order.job_cat == 'repeat'">
        <h5>Preview ordered items</h5>
        <table class="table table-bordered table-hover grid">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Remove</th>
                   
                </tr>
            </thead>
            <tbody>
                <tr
                v-for="(i, index) in orderedItems"
                :key="index">
                    <td>{{i.name}}</td>
                    <td>{{i.qty}}</td>
                    <td><button v-on:click.prevent="removeItem(index)">Remove</button></td>
                   
                </tr>
            </tbody>
        </table>
        <button v-if="(submitted && !finish)" v-on:click.prevent="finishOrder">Finish Order</button>
    </div>

    </div>

    
    <div v-if="finish">
        <h5>Job {{newJob.job_number}} successfully created</h5>
        <br>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>#</th>
                    <th>BOM</th>
                    <th>Qty</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(finishedjob, index) in finishedNewOrder"
                :key="index">
                    <td>{{index+1}}</td>
                    <td>{{finishedjob.bom_name}}</td>
                    <td>{{finishedjob.qty}}</td>
                </tr>
            </tbody>
        </table>
         <nuxt-link to='/jobs'>
        <button>Go back to JOB list</button>
        </nuxt-link>
    </div>

</div>


</template>

<script>
//import axios from "axios";
import newBom from "@/components/bom/newBom";

export default {
    middleware: ['auth'],
    components: {
        newBom
    },

    data () {
        return {
            boms: [], //items from stock are displayed for job selection
            bom: '',
            submitted: false,
            order: {
                id: 0,
                po_number: null,
                req_del: "",
                customer: "",
                job_cat: "",
                job_status: ""
            },
            orderedItems: [],
            selectedItem: {},
            orderedItem: {
                //id: "",
                name: "",
                qty: ""
            },
            newJobID: "",
            newJob: {},
            finish: false,
            finishedNewOrder: [],
            componentKey: 0,
            customers: []
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

        async createOrder() {

            let newDate = new Date()
            let mth = ('0' + (newDate.getMonth()+1)).slice(-2) 
            let yr = (newDate.getFullYear()).toString().slice(-2)
            let yr_month = yr + mth
            //console.log('newDate = ', newDate)
            //console.log('month = ', mth)
            
            
            let newJobID =  await this.$axios
                .$post("/jobs_new", {
                    id: this.order.id,
                    yr_month: yr_month,
                    po_number: this.order.po_number,
                    req_del: this.order.req_del,
                    customer: this.order.customer,
                    job_cat: this.order.job_cat,
                    status: 'new',
                    created_on: newDate.getFullYear().toString()+'-'+mth.toString()+'-'+newDate.getDate().toString(),
                    //ordered_items: JSON.stringify(this.orderedItems)
                })
                
                //this.newJobID = newJobID[7][0].idjobs
                this.newJobID =  newJobID.insertId
                console.log('newJobID', newJobID)
                this.submitted = true
                
            let newJob = await this.$axios
                .$get(`/jobs`) //.$get(`/jobs/${this.newJobID}`)
                //this.newJob = newJob[0];
                //let jobID = this.newJob.idjobs2
                this.newJob = newJob[newJob.length-1]
                let jobID = this.newJob.idjobs2
                
                if(jobID < 10)
                {
                    jobID = '00'+jobID
                    //console.log('ID length', jobID.length)
                }
                else if(jobID > 9 && jobID < 100)
                {
                    jobID = '0'+ jobID
                    //console.log('ID length', jobID.length)
                }
                else {
                    jobID = jobID
                   // console.log('ID length', jobID.length)
                }
                this.newJob.job_number = yr_month + '-' + jobID
                //console.log('get newJob =', this.newJob)
                await this.$axios.$post(`/jobs_jobnumber`, {
                    yr_month: yr_month, 
                    idjobs2: this.newJob.idjobs2,
                    job_number: this.newJob.job_number})
            
            
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
        },
        async addBOM() {
           this.boms = await this.$axios.$get("/bom_list")
           this.order.job_cat = 'repeat' 
        },

        addAnother() {
            this.componentKey += 1;
        }
    
           
    },
//Gets items from stock for adding into the job, must change to PCBAs
    created: async function() {
        let boms = await this.$axios.$get("/bom_list")//.then(response => {
        this.boms = boms//response.data;
    //});

        this.customers = await this.$axios.$get("/customers")
  
},
         
}

</script>

<style scoped>

</style>