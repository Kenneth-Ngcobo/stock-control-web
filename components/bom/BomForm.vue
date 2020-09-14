<template>
    <div id="bomForm">
      
        <form class="form-horizontal">
            <div class="form-group">
            <label class="control-label col-sm-2" for>BOM Name:</label>
            <input type="text" v-model="item.bom_name" required placeholder="Unique BOM name"/>
            </div>
            <div class="form-group">
            <label class="control-label col-sm-2" for>BOM Description:</label>
            <input type="text" v-model="item.description" required placeholder="BOM Description"/>
            </div>
            <div class="form-group">
            <label class="control-label col-sm-2" for>Customer:</label>
            <input type="text" v-model="item.customer" required placeholder="Customer"/>
            </div>   
            <button v-on:click.prevent="$emit('createBOM')">Create BOM</button>
        </form>
    </div>
</template>

<script>
export default {
    props:{
        item: {
            type: Object,
            default(){
                return {
                    bom_name: '',
                    description:'',
                    customer:''
                }
            }
        }
    },
    created(){
        if(!this.item.hasOwnProperty('description'))
        {
            this.item.description = '';
        }
    }
}
</script>