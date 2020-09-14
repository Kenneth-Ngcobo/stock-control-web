<template>
<span>
    <select v-model="job_detail.stage">
        <option value="" disabled selected hidden>Select job stage</option>
        <option value="components ordered">Components ordered</option>
        <option value="components received">Components received</option>
        <option value="kit completed">Kit completed</option>
        <option value="smt completed">SMT completed</option>
        <option value="conventional completed">Conventional completed</option>
        <option value="testing">Testing</option>
        <option value="invoice generated">Invoice generated</option>
        <option value="despatched">Despatched</option>
    </select>
    <input type="text" v-model="job_detail.stage_qty" placeholder="Qty">
    <input type="date" v-model="job_detail.stage_date" placeholder="Date">
    <select v-model="job_detail.status">
        <option value="" disabled selected hidden>Select job status</option>
        <option value="okay">Okay</option>
        <option value="repair">Repair</option>
        <option value="scrap">Scrap</option>
    </select>
    <input type="text" v-model="job_detail.user" placeholder="Initials">
</span>
</template>

<script>
    export default {
        name: 'JobStage',
        data() {
            return {
                job_detail: {
                    stage: "",
                    status: "",
                    stage_qty: "",
                    stage_date: "",
                    user: ""
                },
                job_details: [],
            }
            },
        created() {
             this.$nuxt.$on('printData', () => {
                //this.job_details.push(this.job_detail);
                //this.job_detail = {};
                //console.log(this.job_detail);
            })
        }

        }
  
    
</script>

<style scoped>

input[type="text"] {
    width: 60px;
}

select {
    padding: 5px;
}

</style>