<template>
<div>
  <div>
    Welcome to jobs
  </div>
   <nuxt-link class="nav-link" to='/jobs/newjob2'>
   <button>New Job</button>
   </nuxt-link>

  <table class="table table-bordered table-hover grid">
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
          <td>{{job.created_on}}</td>   <!--.split(' ')[0]-->               
          <td>{{job.req_del}}</td> <!--.split('T')[0]-->
        </tr>
      </tbody>
    </table>

  <no-ssr placeholder="Loading...">
   <v-client-table :data="jobs" :columns="columns" :options="options" name="jobstable">
     <span slot="job_number" slot-scope="{row}"> 
            <!--a href="/components">{{row.job_number}}</a-->
            <nuxt-link :to="`/jobs/${row.idjobs2}`">{{row.job_number}}</nuxt-link>
        </span> 
      <span slot="#" slot-scope="{index}">
        {{index}}
      </span>
   </v-client-table>
  </no-ssr>


</div>
</template>

<script>


import { ServerTable, ClientTable } from 'vue-tables-2';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

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
    components: { ClientTable },
    data() {
    return {
      jobs: [],
      columns: ['#', 'job_number', 'customer', 'po_number', 'job_cat', 'job_status', 'created_date', 'req_del'],
      options: {
            headings: {job_number: 'Job Number', customer: 'Customer', po_number: 'PO Number', job_cat: 'Job Cat', job_status: 'Job Status', created_date: 'Created Date', req_del: 'Date Required'},
            columnsDropdown: true,
            saveState: true,
            dateFormat: 'DD/MM/YYYY',
            texts: {
              filterPlaceholder: 'Search jobs'
            }
            //name: 'jobstable'
        }
      //j_no: []
      
    };
  },

  methods: {
      edit() {
          console.log('Ive been clicked')
      }

  },


  created: async function() {
    this.jobs = await this.$axios.$get("/jobs")
  
    
  },
  

  }
  
  


</script>

<style scoped>

</style>