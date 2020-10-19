<template>
<div>
  <div>
   <nuxt-link class="nav-link" to='/jobs/newjob2'>
   <b-button type="submit" variant="outline-primary" style="margin-left:-1%" >New Job</b-button>
   </nuxt-link>

  <!--b-button v-on:click="new_job = true">New Job</b-button-->
</div>
  <!--table class="table table-bordered table-hover grid">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Job No</th>
          <th scope="col">Customer</th>
          <th scope="col">PO</th>
          <th scope="col">Job Cat</th>
          <th scope="col">Job Status</th>
          <th scope="col">Date Created</th>
          <th scope="col">Req Delivery Date</th>
        </tr>
      </thead>
      <tbody>
        <tr
        v-for="(job, index) in jobs"
        v-bind:key="job.idjobs2"
        >
          <td>{{index+1}}</td>
          <td><nuxt-link :to="`/jobs/${job.idjobs2}`">{{job.job_number}}</nuxt-link></td> 
          <td>{{job.customer}}</td>
          <td>{{job.po_number}}</td>
          <td>{{job.job_cat}}</td>
          <td>{{""}}</td>
          <td>{{job.created_on}}</td>                 
          <td>{{job.req_del}}</td> 
        </tr>
      </tbody>
  </table-->
   <div v-if="view_comments" id="myModal" class="modal" >

     <div class="modal_backdrop" @click="closeComments()"/>

    <div  class="modal-content">
    <div style="display: inline"> <!--class="form-group"-->
    <b-button v-on:click="add_comment = true">Add</b-button>
    <button v-on:click.prevent="closeComments()" class="close" >&times;</button>
    </div>
    <h6>{{job_number}}</h6>
    <table class="table table-bordered table-hover" v-if="comments.length>0">
      <thead>
        <tr>
          <th>Comment</th>
          <th>Person</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="com in comments" :key="com.idcomments">
          <td>{{com.comment}}</td>
          <td>{{com.person}}</td>
          <td>{{com.date}}</td>
        </tr>
      </tbody>
    </table>
    <div v-else>No comments to show</div>
    <div v-if="add_comment">
    <textarea name="" id="" cols="75" rows="5" v-model="comment"></textarea>
    <br>
    <b-button v-on:click="submitComments">Submit</b-button>
    </div>
    </div>
    </div>
<!----------------------------------------- NEW JOB MODAL ----------------------------------------->

  <div v-if="new_job" id="myModal" class="modal" >

    <div class="modal_backdrop" @click="new_job = false"/>

    <div class="modal-content">
    
      <newjob/>
    
    </div>
  </div>

<!-------------------------------------------------------------------------------------------------->

  <no-ssr placeholder="Loading..."> <!--no-ssr-->
   <v-client-table :data="jobs" :columns="columns" :options="options" name="jobstable" style="width:80%">
     <span slot="job_number" slot-scope="{row}"> 
            <!--a href="/components">{{row.job_number}}</a-->
            <nuxt-link :to="`/jobs/${row.job_number}`">{{row.job_number}}</nuxt-link>
        </span> 
      <span slot="#" slot-scope="props">
        {{props.index}}
      </span>
      <span slot="progress" slot-scope="{row}">
        <b-progress :value="progressValue(row)" :max="progressMax(row)" show-progress animated></b-progress>
      </span>
      <span slot="due" slot-scope="{row}">
        {{ dueDays(row) }}
      </span>
      <span slot="comments" slot-scope="{row}">
        <b-button type="submit" variant="outline-primary"  v-on:click="viewComments(row.job_number)">View</b-button>
      </span>
   </v-client-table>
  </no-ssr> <!--/no-ssr-->


</div>
</template>

<script>


import { ServerTable, ClientTable } from 'vue-tables-2';
import newjob from "@/components/job/newjob";

const defaultTableOpt = {
    skin: 'table table-hover',
    sortIcon: {
    is: 'fa-sort',
    base: 'fas',
    up: 'fa-sort-up',
    down: 'fa-sort-down',
   
  }
};


  export default {
    middleware: ['auth'],
    components: { ClientTable, newjob },
    data() {
    return {
      jobs: [],
      server_comments: [],
      comments: [],
      comment: '',
      opened_job: '',
      view_comments: false,
      add_comment: false,
      all_stages: [],
      new_job: false,
      ordered_boms: [],
      columns: ['#', 'job_number', 'due','customer', 'po_number', 'job_cat', 'status', 'created_on', 'req_del', 'progress', 'comments'],
      options: {
            headings: {job_number: 'Job Number', due: 'Due In (Days)', customer: 'Customer', po_number: 'PO Number', job_cat: 'Job Cat', status: 'Job Status', created_on: 'Created Date', req_del: 'Date Required'},
            columnsDropdown: true,
            saveState: true,
            dateFormat: 'DD/MM/YYYY',
            texts: {
              filterPlaceholder: 'Search jobs'
            },
            
            /*rowClassCallback: (row) => {

              if(row.hasOwnProperty('req_del'))
              {
                if(row.req_del != null) {
                   return (this.dueDays(row)<-10) ? 'overdue' : '' 
                }
              }
          
               return ''  
            
             },*/
             cellClasses:{
                due: [
                  {
                    class:'overdue',
                    condition: row => this.dueDays(row)<-10
                  },
                  {
                    class: 'halfway',
                    condition: row => this.dueDays(row) >-10
                  }
                ]
                
            }
            

      } //END OF OPTIONS
      
    };
  },

  computed: {
   /* dueDays() {

      }*/
  },

  methods: {
      edit() {
          console.log('Ive been clicked')
      },

      dueDays(row) {
        let newDate = new Date()
        let mth = ('0' + (newDate.getMonth()+1)).slice(-2)
        let dt = ('0' + (newDate.getDate())).slice(-2)
        let today = newDate.getFullYear().toString()+'-'+mth.toString()+'-'+dt.toString()
        return Math.floor(( Date.parse(row.req_del) - Date.parse(today))/86400000)
        
      },
      
      viewComments(job_number) {
        this.view_comments = true
        this.comments = this.server_comments.filter(c => c.job_number == job_number)
        this.opened_job = job_number
        //alert(job_number)
      },

      closeComments() {
        this.opened_job = ''
        this.view_comments = false
      },

      async submitComments() {
      let newDate = new Date()
      let mth = ('0' + (newDate.getMonth()+1)).slice(-2)
      let dt = ('0' + (newDate.getDate())).slice(-2)
      
      await this.$axios.$post('/comments', {
        comment: this.comment,
        person: this.$auth.user.username,
        job_number: this.opened_job,
        date: newDate.getFullYear().toString()+'-'+mth.toString()+'-'+dt.toString()})
        
      this.server_comments = await this.$axios.$get("/comments")
      await this.viewComments(this.opened_job)
      this.add_comment = false
    },

    progressValue(row) {
        let value = this.all_stages.filter(r => r.jobID == row.job_number)
        //this.value.push(value.length)
        return value.length
    },

    progressMax(row) {
      let ordered_boms = this.ordered_boms.filter(ob => ob.job_number == row.job_number)
      //this.max.push(ordered_boms.length*13)
      return ordered_boms.length*13
    }

  },


  created: async function() {
    this.jobs = await this.$axios.$get("/jobs")
    this.ordered_boms = await this.$axios.$get("/ordered_boms")
    this.server_comments = await this.$axios.$get("/comments")
    this.all_stages = await this.$axios.$get('/job_stages')
    
  },
  

  }
  
  


</script>

<style>

.overdue {
  background-color: rgb(255, 122, 122);
}

.halfway {
  background-color: lightgreen;
}

.closetodel {
  background-color: lightyellow;
}

.modal {
  display: block;
  position: fixed; /* Stay in place */
  z-index: 9; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

.modal_backdrop {
    background-color: rgba(0, 0, 0, 0.3);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
  }

/* Modal Content/Box */
.modal-content {
  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 60%;
  z-index: 2; /* Could be more or less, depending on screen size */
}

.close {
  color: black;
  float: right;
  margin-left: 95%;
  margin-top: -5%;
  font-size: 28px;
  font-weight: bold;
}

</style>