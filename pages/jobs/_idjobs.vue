<template>
    <div>
        <nuxt-child :job="job" :ordered_boms="ordered_boms" :items="items"/>
    </div>
</template>

<script>
    //import axios from "axios";
    export default {
    middleware: ['auth'],
    data() {
        return {
            job: [],
            ordered_boms: [],
            items: []
        
        }
    },
    created: async function() {
        //Find THE SPECIFIC JOB THAT THE UNSER CLICKS, THIS GETS SENT DOWN TO CHILD ROUTES
        let job = await this.$axios.$get("/jobs/")
        this.job = job.find(v => v.job_number == this.$route.params.idjobs);
    
      
        //this.job.req_del = this.job.req_del //.split('T')[0]
        
        //FIND THE BOMS ORDERED ON THIS SPECIFIC JOB
        this.ordered_boms = await this.$axios.$get(`/ordered_boms/${this.job.job_number}`)
       

        this.items = await this.$axios.$get(`/fig_items`)
         
                    
    
    }, 
}
</script>

<style scoped>

</style>