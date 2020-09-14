<template>
    <div>
        
    <span class="col-md-7 float-right">
      <div class="d-flex justify-content-center"><b>Job Stage</b></div>
      <select v-model="job_stages.stage">
        <option value="" disabled selected hidden>Select job stage</option>
        <option value="data pack received">Data pack recieved</option>
        <option value="supplier quote sent">Supplier quote sent</option>
        <option value="supplier quote received">Supplier quote recieved</option>
        <option value="customer quote sent">Customer quote sent</option>
        <option value="po received">PO recieved</option>
        <option value="components ordered">Components ordered</option>
        <option value="components received">Components received</option>
        <option value="kit completed">Kit completed</option>
        <option value="smt completed">SMT completed</option>
        <option value="conventional completed">Conventional completed</option>
        <option value="testing">Testing</option>
        <option value="invoice generated">Invoice generated</option>
        <option value="despatched">Despatched</option>
    </select>
    <input type="text" v-model="job_stages.stage_qty" placeholder="Qty">
    <input type="date" v-model="job_stages.stage_date" placeholder="Date">
    <select v-model="job_stages.status">
        <option value="" disabled selected hidden>Select job status</option>
        <option value="okay">Okay</option>
        <option value="repair">Repair</option>
        <option value="scrap">Scrap</option>
    </select>
    <input type="text" v-model="job_stages.user" placeholder="Initials">
    <button v-on:click="addStage">Enter</button>
    </span>      
        <!--button v-on:click="showOrder">Show Order</button-->

    <!--stage-display :job_stages="job_stages"></stage-display-->
        
        <!--table class="table table-bordered table-hover grid">
            <thead>
                <tr>
                    <th>Job Stage</th>
                    <th>Qty</th>
                    <th>Date modified</th>
                    <th>Job Status</th>
                    <th>Modified by</th>
                    <th>Modify</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(stage,index) in stages"
                :key="stage.id">
                <td>{{stage.stage}}</td>
                
                <td v-if="getStage(index).stage_qty == null">
                  <input type="text" v-model="job_stages.stage_qty">
                </td>

                <td v-if="getStage(index).date_modified == null">
                  <input type="date" v-model="job_stages.date_modified">
                </td>

                <td v-if="getStage(index).job_status == null">
                  <input type="text" v-model="job_stages.job_status">
                </td>

                <td v-if="getStage(index).person == null">
                  <input type="text" v-model="job_stages.person">
                </td>

                 <td v-if="getStage(index).person == null">
                    <button v-on:click="addStage(index)">Add</button>
                </td>
                
                <td input v-text="getStage(index).stage_qty"></td>
                <td v-text="getStage(index).date_modified"></td>
                <td v-text="getStage(index).job_status" ></td>
                <td v-text="getStage(index).person"></td>
                <!--td v-if="getStage(index).person == !null"><button>Edit</button></td>
                </tr>
                <!--tr
                v-for="i in job_stages"
                :key="i.idstages">
                    <td>{{i.job_stage}}</td>
                    <td>{{i.stage_qty}}</td>
                    <td>{{i.date_modified.split('T')[0]}}</td>
                    <td>{{i.job_status}}</td>
                    <td>{{i.person}}</td> 
                </tr>
            </tbody>
        </table-->

    
    </div>
</template>

<script>
    export default {
    }
</script>

<style scoped>



</style>