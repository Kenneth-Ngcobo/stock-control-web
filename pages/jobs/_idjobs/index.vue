<template>
<div id="page">
  <!-------------------------------------JOB DETAILS----------------------------------------------->
  <div class="col-md-5 float-left">
    
    <table class="table">
      <tbody>
        <tr>
          
          <td><b>Job No</b></td>
          <td><b>: {{job.job_number}}</b></td>
          <td class="empty-col"></td>
          <!--div v-if="job.po_number != null"-->
          <td v-if="job.po_number != null"><b>PO No</b></td>
          <td v-if="job.po_number != null"><b>: {{job.po_number}}</b></td>
         
          
        </tr>
        <tr>
          
          <td><b>Customer</b></td>
          <td><b>: {{job.customer}}</b></td>
          <td class="empty-col"></td>
          <!--span v-if="job.invoice_number != null"-->
          <td v-if="job.invoice_number != null"><b>Invoice No</b></td>
          <td v-if="job.invoice_number != null"><b>: {{job.invoice_number}}</b></td>
         
          
        </tr>
        <tr>
          <td><b>Due Date</b></td>
          <td><b>: {{job.req_del}}</b></td>
          <td class="empty-col"></td>
          <!--span v-if="job.invoice_number_r != null"-->
          <td v-if="job.invoice_number_r != null"><b>Invoice2 No</b></td>
          <td v-if="job.invoice_number_r != null"><b>: {{job.invoice_number_r}}</b></td>
         
        </tr>
      </tbody>
    </table>




    <!----------------------------------------ITEMS ON ORDER----------------------------------------->
    <h5>Items on job:</h5>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Select</th>
          <th>Item</th>
          <th>Qty</th>
          <th>Status</th>
        </tr>
      </thead>
        <tbody>
          <tr v-for="item in ordered_boms"
          v-bind:key="item.idordered_boms">
          <td><input type="radio" :value="item.idordered_boms" v-on:change="radioValue" v-model="pcba_id"></td> <!---------------{{ displayIndex(item)+1 }}-->
          <td><nuxt-link :to="`/jobs/${job.idjobs2}/${item.idordered_boms}`">{{ item.bom_name }}</nuxt-link></td> <!--nuxt-link :to="`/jobs/${order.idorders}/${ordered_items.idordered_items}`"> </nuxt-link-->
          <td>{{item.qty}}</td>
          <td v-text="getBomStage(item.idordered_boms)"></td>
          </tr>
        </tbody>
    </table>
    <!--button v-on:click="add = true">Add Bom</button>
    <div v-if="add">
      <add-bom></add-bom>
    </div-->
  </div>
  <!------------------------------------JOB STAGE DISPLAY SECTION------------------------------------------------------>
    
    <!----------------------------------------Table Displaying the stages-------------------------------------->
    <div class="col-md-7 float-right">
      
      <form class="form-horizontal, form-main"
            v-for="(stage,index) in stages"
            :key="stage.id"> <!--style="width:50%; margin:auto;"-->
            <div class="form-group">
                <input type="radio" :value="stage.id" v-model="checkedID">
                <label class="control-label col-sm-4">{{stage.stage}}</label>
                <input v-if="index>7" type="text" v-model="stage_qty[index]" :readonly="checkedID!=stage.id" :placeholder="getStage(stage.stage).stage_qty || 'Qty'">
                <span v-else><tr><td class="empty-col"></td></tr></span>

                

                <input type="text" v-if="getStage(stage.stage).date_modified != null" v-model="date_modified[index]" :readonly="checkedID!=stage.id" id="date-input" :placeholder="getStage(stage.stage).date_modified"> <!--.split('')[0] || ''-->
                <input type="date" v-if="getStage(stage.stage).date_modified == null" v-model="date_modified[index]" :readonly="checkedID!=stage.id" id="date-input">
                <select v-if="getStage(stage.stage).job_status == null" v-model="job_status[index]">
                    <option value="" disabled selected hidden>Select status</option>
                    <option value="okay">Okay</option>
                    <option value="repair">Repair</option>
                    <option value="scrap">Scrap</option>
                </select>
                <input type="text" id="status" v-if="getStage(stage.stage).job_status != null" v-model="job_status[index]" :readonly="checkedID!=stage.id" :placeholder="getStage(stage.stage).job_status">
                <input type="text" v-model="person[index]" :readonly="checkedID!=stage.id" :placeholder="getStage(stage.stage).person || 'Initials'">
                <button v-on:click.prevent="addStage(stage.stage, index)">Modify</button>
              <span v-if="check_qty">
                <span v-if="index == 4">
                <span v-if="(typeof getStage('PO received').stage_qty != 'undefined') && job.po_number == null">
                 <tr><td class="empty-col4"></td></tr>
                <input id="po-number" type="text" v-model="po_number" placeholder="Enter PO No">
                <button v-on:click.prevent="addPO">Add</button>
                </span>
                </span>

                <span v-if="index == 11">
                <span v-if="(typeof getStage('Invoice generated').stage_qty != 'undefined') && job.invoice_number == null">
                 <tr><td class="empty-col3"></td></tr>
                
                <input id="po-number" type="text" v-model="invoice_number" placeholder="Enter Invoice No">
                <button v-on:click.prevent="addInvoice">Add</button>
                </span>
                </span>
              </span>
            </div>
       </form>
<!------------------------------------------------- ITEMS REMAINING FROM THE JOB -------------------------------------------------------------------------------->
        <span v-if="check_qty">

            <span v-if="(typeof getStage('SMT completed').stage_qty !='undefined') && (getStage('SMT completed').stage_qty < getBOM(pcba_id).qty)">
              <h6><b>Items remaining from  the job</b></h6>
              <form class="form-horizontal">
                <!--input type="radio" :value="stage.id" v-model="checkedID"-->
                <input type="radio" :value="1" v-model="checkedIDR">
                <label class="control-label col-sm-4">SMT Completed</label>
                <input type="text" v-model="smtjob_stage.stage_qty" :readonly="checkedIDR!=1" :placeholder="getStage('SMT completed - R').stage_qty || 'Qty'">
                <input type="date" v-if="getStage('SMT completed - R').date_modified == null" :readonly="checkedIDR!=1" id="date-input"  v-model="smtjob_stage.date_modified">
                <input type="text" v-if="getStage('SMT completed - R').date_modified != null" :readonly="checkedIDR!=1" :placeholder="getStage('SMT completed - R').date_modified" id="date-input" v-model="smtjob_stage.date_modified">
                <select v-if="getStage('SMT completed - R').job_status == null" v-model="smtjob_stage.job_status">
                    <option value="" disabled selected hidden>Select status</option>
                    <option value="okay">Okay</option>
                    <option value="repair">Repair</option>
                    <option value="scrap">Scrap</option>
                </select>
                <input type="text" id="status" v-else :readonly="checkedIDR!=1" :placeholder="getStage('SMT completed - R').job_status" v-model="smtjob_stage.job_status">
                <input type="text" v-model="smtjob_stage.person" :readonly="checkedIDR!=1" :placeholder="getStage('SMT completed - R').person || 'Initials'">
                <button v-on:click.prevent="remainingSMT(smtjob_stage, getStage('SMT completed - R').idstages)">Modify</button>
              </form> 
            </span>

            <span v-if="(typeof getStage('Conventional completed').stage_qty !='undefined') && (getStage('Conventional completed').stage_qty < getBOM(pcba_id).qty)">
              
              <form class="form-horizontal">
                <!--input type="radio" :value="stage.id" v-model="checkedID"-->
                <input type="radio" :value="2" v-model="checkedIDR">
                <label class="control-label col-sm-4">Conventional Completed</label>
                <input type="text" v-model="cnvjob_stage.stage_qty" :readonly="checkedIDR!=2" :placeholder="getStage('Conventional completed - R').stage_qty || 'Qty'">
                <input type="date" v-if="getStage('Conventional completed - R').date_modified == null" id="date-input" v-model="cnvjob_stage.date_modified">
                <input type="text" v-else :readonly="checkedIDR!=2" :placeholder="getStage('Conventional completed - R').date_modified" id="date-input" v-model="cnvjob_stage.date_modified">
                <select v-if="getStage('Conventional completed - R').job_status == null" v-model="cnvjob_stage.job_status">
                    <option value="" disabled selected hidden>Select status</option>
                    <option value="okay">Okay</option>
                    <option value="repair">Repair</option>
                    <option value="scrap">Scrap</option>
                </select>
                <input type="text" id="status" v-else :readonly="checkedIDR!=2" :placeholder="getStage('Conventional completed - R').job_status" v-model="cnvjob_stage.job_status">
                <input type="text" v-model="cnvjob_stage.person" :readonly="checkedIDR!=2" :placeholder="getStage('Conventional completed - R').person || 'Initials'">
                <button v-on:click.prevent="remainingSMT(cnvjob_stage, getStage('Conventional completed - R').idstages)">Modify</button>
              </form> 
            </span>

            <span v-if="(typeof getStage('Testing').stage_qty !='undefined') && (getStage('Testing').stage_qty < getBOM(pcba_id).qty)">
              
              <form class="form-horizontal">
                <!--input type="radio" :value="stage.id" v-model="checkedID"-->
                 <input type="radio" :value="3" v-model="checkedIDR">
                <label class="control-label col-sm-4">Testing</label>
                <input type="text" v-model="tstjob_stage.stage_qty" :readonly="checkedIDR!=3" :placeholder="getStage('Testing - R').stage_qty || 'Qty'">
                <input type="date" v-if="getStage('Testing - R').date_modified == null" id="date-input" v-model="tstjob_stage.date_modified">
                <input type="text" v-else :readonly="checkedIDR!=3" :placeholder="getStage('Testing - R').date_modified" id="date-input" v-model="tstjob_stage.date_modified">
                <select v-if="getStage('Testing - R').job_status == null" v-model="tstjob_stage.job_status">
                    <option value="" disabled selected hidden>Select status</option>
                    <option value="okay">Okay</option>
                    <option value="repair">Repair</option>
                    <option value="scrap">Scrap</option>
                </select>
                <input type="text" id="status" v-else :readonly="checkedIDR!=3" :placeholder="getStage('Testing - R').job_status" v-model="tstjob_stage.job_status">
                <input type="text" v-model="tstjob_stage.person" :readonly="checkedIDR!=3" :placeholder="getStage('Testing - R').person || 'Initials'">
                <button v-on:click.prevent="remainingSMT(tstjob_stage, getStage('Testing - R').idstages)">Modify</button>
              </form> 
            </span>

            <span v-if="(typeof getStage('Invoice generated').stage_qty !='undefined') && (getStage('Invoice generated').stage_qty < getBOM(pcba_id).qty)">
              
              <form class="form-horizontal">
                <!--input type="radio" :value="stage.id" v-model="checkedID"-->
                 <input type="radio" :value="4" v-model="checkedIDR">
                <label class="control-label col-sm-4">Invoice generated</label>
                <input type="text" v-model="invjob_stage.stage_qty" :readonly="checkedIDR!=4" :placeholder="getStage('Invoice generated - R').stage_qty || 'Qty'">
                <input type="date" v-if="getStage('Invoice generated - R').date_modified == null" id="date-input" v-model="invjob_stage.date_modified">
                <input type="text" v-else :readonly="checkedIDR!=4" :placeholder="getStage('Invoice generated - R').date_modified" id="date-input" v-model="invjob_stage.date_modified">
                <select v-if="getStage('Invoice generated - R').job_status == null" v-model="invjob_stage.job_status">
                    <option value="" disabled selected hidden>Select status</option>
                    <option value="okay">Okay</option>
                    <option value="repair">Repair</option>
                    <option value="scrap">Scrap</option>
                </select>
                <input type="text" id="status" v-else :readonly="checkedIDR!=4" :placeholder="getStage('Invoice generated - R').job_status" v-model="invjob_stage.job_status">
                <input type="text" v-model="invjob_stage.person" :readonly="checkedIDR!=4" :placeholder="getStage('Invoice generated - R').person || 'Initials'">
                <button v-on:click.prevent="remainingSMT(invjob_stage, getStage('Invoice generated - R').idstages)">Modify</button>
              </form> 
              <span v-if="(typeof getStage('Invoice generated - R').stage_qty != 'undefined') && job.invoice_number_r == null">
              <tr><td class="empty-col2"></td></tr>
              <input placeholder="Enter Invoice NO." id="po-number" type="text" v-model="invoice_number_r">
              <button v-on:click="addInvoiceR">Add</button>
              </span>
            </span>

            <span v-if="(typeof getStage('Despatched').stage_qty !='undefined') && (getStage('Despatched').stage_qty < getBOM(pcba_id).qty)">
              
              <form class="form-horizontal">
                <!--input type="radio" :value="stage.id" v-model="checkedID"-->
                 <input type="radio" :value="5" v-model="checkedIDR">
                <label class="control-label col-sm-4">Despatched</label>
               
                <input type="text" v-model="desjob_stage.stage_qty" :readonly="checkedIDR!=5" :placeholder="getStage('Despatched - R').stage_qty || 'Qty'">
                <input type="date" v-if="getStage('Despatched - R').date_modified == null" id="date-input" v-model="desjob_stage.date_modified">
                <input type="text" v-else :readonly="checkedIDR!=5" :placeholder="getStage('Despatched - R').date_modified" id="date-input" v-model="desjob_stage.date_modified">
                <select v-if="getStage('Despatched - R').job_status == null" v-model="desjob_stage.job_status">
                    <option value="" disabled selected hidden>Select status</option>
                    <option value="okay">Okay</option>
                    <option value="repair">Repair</option>
                    <option value="scrap">Scrap</option>
                </select>
                <input type="text" id="status" v-else :readonly="checkedIDR!=5" :placeholder="getStage('Despatched - R').job_status" v-model="desjob_stage.job_status">
                <input type="text" v-model="desjob_stage.person" :readonly="checkedIDR!=5" :placeholder="getStage('Despatched - R').person || 'Initials'">
                <button v-on:click.prevent="remainingSMT(desjob_stage, getStage('Despatched - R').idstages)">Modify</button>
              </form> 
            </span>
        </span>   

    </div>
</div>
</template>

<script>
//import stageDisplay from "@/components/job/addBom";
export default {
  props: ['ordered_boms'],

  components:{
        //addBom
    },

  data() {
    return {
      id: this.$route.params.idjobs,
      pcba_id: 0,
      selectedStatus: "",
      idstage: 0,
      stage_qty: [],
      date_modified: [],
      person: [],
      job_status: [],

      job_stage: {  //V-MODELLED FROM THE INPUT
          stage: "",
          status: "",
          stage_qty: "",
          stage_date: "",
          user: ""
      },
      smtjob_stage: {
          id: 0,
          job_stage: "SMT completed - R",
          job_status: "",
          stage_qty: "",
          date_modified: "",
          person: "",
          jobID: "",
          itemNO: ""
      },

      cnvjob_stage: {
          id: 0,
          job_stage: "Conventional completed - R",
          job_status: "",
          stage_qty: "",
          date_modified: "",
          person: "",
          jobID: "",
          itemNO: ""
      },

      tstjob_stage: {
          id: 0,
          job_stage: "Testing - R",
          job_status: "",
          stage_qty: "",
          date_modified: "",
          person: "",
          jobID: "",
          itemNO: ""
      },

      invjob_stage: {
          id: 0,
          job_stage: "Invoice generated - R",
          job_status: "",
          stage_qty: "",
          date_modified: "",
          person: "",
          jobID: "",
          itemNO: ""
      },

      desjob_stage: {
          id: 0,
          job_stage: "Despatched - R",
          job_status: "",
          stage_qty: "",
          date_modified: "",
          person: "",
          jobID: "",
          itemNO: ""
      },

      job_stages: [], //LOADED FROM THE DATABASE
      lastIndex: "",
      job: {},
      stages: [{id:1, stage: 'Data pack received'},{id:2, stage:'Supplier quote sent'},{id:3, stage:'Supplier quote received'},{id:4, stage:'Customer quote sent'},{id:5, stage:'PO received'},{id:6, stage:'Components ordered'},{id:7, stage:'Components received'},{id:8, stage:'Kit completed'},{id:9, stage:'SMT completed'},{id:10, stage:'Conventional completed'},{id:11, stage:'Testing'},{id:12, stage:'Invoice generated'},{id:13, stage:'Despatched'}],
      checkedID: '',
      checkedIDR: '',
      send_date: '',
      send_qty: '',
      send_status: '',
      send_person: '',
      check_qty: false,
      po_number: '',
      invoice_number: null,
      invoice_number_r: '',
      all_stages: [],
      add : false
      
    };
  },

  methods: {
    //displayIndex: function(item) {
     // return this.orderArray.indexOf(item);
    //},

    addStage: async function(stage, index) {
        //console.log('Stage = ', stage)
        let check_stage = await this.getStage(stage)
        //console.log('Type of check stage = ', typeof check_stage.job_stage)
        //console.log('Check stage = ', check_stage)

        
        if(typeof check_stage.job_stage != 'undefined'){ //Checking if stage exists
          this.id = check_stage.idstages //Give the ID of the existing stage
          if(this.date_modified.length == 0) { //If the date input has not been entered, send previous stage date
            this.send_date = check_stage.date_modified.split('T')[0]
          }
          else {this.send_date = this.date_modified[index]} //Else send the newly entered date

          if(this.stage_qty.length == 0) { //If stage quantity is empty, send previous stage qty
            this.send_qty = check_stage.stage_qty
          }
          else {console.log(this.send_qty = this.stage_qty[index])} //Else send newly entered qty

          if (this.person.length == 0) { //If initials not entered, keep the previous stage initials
            this.send_person = check_stage.person
          }
          else {this.send_person = this.person[index]} // Else send newly entered initials

          if (this.job_status.length == 0) { //If job status not entered, keep previous stats
            this.send_status = check_stage.job_status
          }
          else {this.send_status = this.job_status[index]} //Else send new status

        await this.$axios
        .$post("/job_stages", {
                  id: this.id,
                  //job_stage: this.job_stages.stage,
                  job_stage: this.stages[index].stage,
                  stage_qty: this.send_qty,
                  date_modified: this.send_date,
                  job_status: this.send_status,
                  person: this.send_person,
                  jobID: this.job.job_number,
                  itemNO: this.pcba_id
        })
          
        }
        else {
          this.id = 0;

          await this.$axios
          .$post("/job_stages", {
                  id: this.id,
                  //job_stage: this.job_stages.stage,
                  job_stage: this.stages[index].stage,
                  stage_qty: this.stage_qty[index],
                  date_modified: this.date_modified[index],
                  job_status: this.job_status[index],
                  person: this.person[index],
                  jobID: this.job.job_number,
                  itemNO: this.pcba_id
        })
        }

        this.radioValue()
       
    },

    radioValue: async function() {
      //GETS JOB STAGES FOR A SPECIFIC JOB AND BOM FROM THE SERVER
     
      this.job_stages = await this.$axios.$get(`job_stages/${this.job.job_number}/${this.pcba_id}`)
      console.log(this.job_stages)
      this.check_qty = true

        //this.lastIndex = this.job_details[this.job_details.length]
    
    },

    getStage(stage) {
        //return this.job_stages[index] || {}
        return this.job_stages.find(st => st.job_stage == stage) || {}
    },

    getBomStage(idordered_boms) {
        //return this.job_stages[index] || {}
        let bom_stage = this.all_stages.filter(stage => stage.itemNO == idordered_boms)
        
        
        if(bom_stage.length <= 1) {
          return "New"
        }
        if(bom_stage.length>1 && bom_stage.length <5) {
        return "Quoting"
        }
        if(bom_stage.length>5 && bom_stage.length <8) {
        return "Ordering"
        }
        if(bom_stage.length == 8) {
        return "Kitting"
        }
        if(bom_stage.length > 8 && bom_stage.length < 11) {
        return "Production"
        }
        if(bom_stage.length == 12) {
        return "Testing"
        }
        if(bom_stage.length >= 13) {
        return "Despatched"
        }
        //else{
        //    return bom_stage.length
        //}

        //return bom_stage[bom_stage.length - 1] || 'New'
        //return this.job_stages.find(st => st.job_stage == stage) || {}
    },

   getBOM(idordered_boms) {
        //return this.ordered_boms[itemNO] || {}
        return this.ordered_boms.find(bom => bom.idordered_boms == idordered_boms) || {}
    },

    async addPO() {
       await this.$axios.$post("/jobs_ponumber", {
            po_number: this.po_number,
            job_number: this.job.job_number})
      await this.findJob()
      //this.radioValue()
    },

   async addInvoice() {
       await this.$axios.$post("/jobs_invoice", {
            invoice_number: this.invoice_number,
            job_number: this.job.job_number})
      await this.findJob()
      //this.radioValue()
    }, 

    async addInvoiceR() {
        
        //console.log(this.job)
        await this.$axios.$post("/jobs_invoiceR", {
            invoice_number_r: this.invoice_number_r,
            job_number: this.job.job_number})
        await this.findJob()
        //this.radioValue()

       
    }, 

    async remainingSMT(job_stage, idstages) {
      //job_stage.job_stage = stage
     
      if(typeof idstages != 'undefined') {
      job_stage.id = idstages
      }
      else {
        job_stage.id = 0
       
        }
      job_stage.jobID =  this.job.job_number
      job_stage.itemNO = this.pcba_id
      console.log(job_stage)

      await this.$axios.$post("/job_stages", job_stage)
      //await this.findJob() 
      this.radioValue()
    },

    async findJob() {
      let job = await this.$axios.$get("/jobs/")
      this.job = job.find(v => v.idjobs2 == this.$route.params.idjobs);
    }

},


created: async function() {
       await this.findJob()

       this.all_stages = await this.$axios.$get(`job_stagesall/${this.job.job_number}`)
        //console.log(this.job)
    }
}

</script>

<style scoped>

#page {
  margin-top: 10px;
}

td {
  padding: 5px;
}

#box {
  margin-left: 10px;
}

input[type="text"] {
    width: 60px;
    height: 25px;
  
}

#status {
  width: 118px;
}

input[type="radio"] {
  margin-left: 10px;
}

#po-number {
  width: 150px;
}

select {
    padding: 2.5px;
}

#date-input {
  width: 120px;
}

button {
  height: 26px;
  font-size: 14px;
}

.form-group {
    position: relative;
    margin: -20px 0px 24px;
}

.form-horizontal {
   margin-top: 0px;
}

.form-main {
  margin-top: 20px;
}

::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: black;
  opacity: 1; /* Firefox */
}

.empty-col {
  width: 60px;
}

.empty-col2 {
  width: 515px;
}

.empty-col3 {
  width: 280px;
}

.empty-col4 {
  width: 345px;
}

h6 {
  margin-left: 12px;
}

</style>