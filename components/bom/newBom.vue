<template>
<div>

    <div v-if="(!submitted && !finish)">

        <bom-form :newJob="newJob" :item="bomFormData" @createBOM="createBOM()"></bom-form>

    </div>
   
    <div v-if="(submitted && !finish)">
    <br>
        <h5>Add Components for {{newBOM.bom_name}} </h5>
        <div class="form-group">
        <label class="control-label col-sm-2">Upload CSV BOM</label>
        <input type="file" accept=".csv" ref="file" v-on:change="handleFileUpload()">
        <button v-on:click="submitFile()">Upload File</button>
        </div>
    
    <!--PREVIEW TABLE FOR SELECTED ITEMS -->
    <br>
    
    
        
        <button v-on:click="count.push(0)">Add New Line</button>
        <!--input class="autocomplete" style="width:300px;" autocomplete="off" v-model="item" @keyup="filterItems" @focus="modal = true"-->

        
        
        <!--button @click="addFigItem">Add</button--->
      
        <datalist id="data">
            <option v-for="item in items" :key="item.id">{{item.part_number}}</option>
        </datalist>
    
        
        <h5>Preview BOM</h5>
        <table class="table table-bordered table-hover grid">
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Fig Item Number</th>
                    <th>Cust Partname</th>
                    <th>Designator</th>
                    <th>Quantity</th>
                   
                </tr>
            </thead>
            <tbody>
                <tr
                v-for="(i, index) in bom"
                :key="index">
                    <td><select>  <!--v-model="type[index]">-->
                        <option value="" disabled selected hidden>{{i.type}}</option>
                        <option value="C">C</option>
                        <option value="M">M</option>
                        </select></td>
                    <td><input list="data" autocomplete="off" v-model="item[index]"></td> <!---{{fig_items[index]}}--->
                    <td>{{i.cust_part_name}}</td>
                    <td>{{i.designator}}</td>
                    <td>{{i.qty}}</td>
                </tr>
                <tr v-for="(count1, index) in count" :key="index">
                    <td><select v-model="newType[index]">
                        <option value="" disabled selected hidden>Select type</option>
                        <option value="C">C</option>
                        <option value="M">M</option>
                    </select></td>
                    <td><input type="text" v-model="newFigItem[index]"></td>
                    <td><input type="text" v-model="newCustNumber[index]"></td>
                    <td><input type="text" v-model="newDesignator[index]"></td>
                    <td><input type="text" v-model="newQuantity[index]"></td>
                </tr>
            </tbody>
        </table>
    </div>
    <!--------------------------------------------------------------------------------------------------->
    <div v-if="(submitted && !finish)">
    <button v-on:click.prevent="finishBOM">Finish BOM</button>
    </div>

    <div v-if="finish">
        <h5>{{newBOM.bom_name}} BOM successfully added</h5>
        <br>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Fig Item Number</th>
                    <th>Cust Partname</th>
                    <th>Designator</th>
                    <th>Quantity</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="newbom in finishedNewBOM"
                :key="newbom.idbom">
                    <td>{{newbom.comp_name}}</td>
                    <td>{{newbom.cust_part_name}}</td>
                    <td>{{newbom.designator}}</td>
                    <td>{{newbom.qty}}</td>
                </tr>
            </tbody>
        </table>
     
        <button v-on:click="$emit('addAnother')">Add another bom</button> <!----LINK TO ADD NEW BOM ----->
        
      
        <button v-on:click.prevent="$emit('addBOM')">Add BOMs to job</button> <!-------MUST GO TO AN ADD BOM to job section--------------->
    </div>

</div> 

</template>

<script>
//import axios from "axios";
import BomForm from "@/components/bom/BomForm";

export default {
    components:{
        BomForm
    },
    props:{
        newJob: {
            type: Object,
            default(){
                return {
                    customer: '',
                    
                }
            }
        }
    },
    data() {
        return {
            file: [],
            items: [],
            item: [],
            fig_items: [],
            pcbaID: [],
            modal: false,
            submitted: false,
            bom_name: '',
            description: "",
            customer: "",
            bom: [],   //bom items loaded from CSV upload
            newBomID: "",
            newBOM: "",
            finish: false,
            finishedNewBOM: [],
            bomFormData: {
                id: 0,
                bom_name: '',
                description:'',
                customer:''
            },
            actual_items: [],
            newline: false,
            type: [],
            newType: [],
            newFigItem: [],
            newCustNumber: [],
            newDesignator: [],
            newQuantity: [],
            count: [],
            another: false
        }
    },

    methods: {
    
        async createBOM() {
            
             let newBomID = await this.$axios.$post("/bom_list", this.bomFormData)
             console.log(newBomID)
                    let bomArray = newBomID[4]
                    let bomObject = bomArray[0]
                    this.newBomID = bomObject.idbom
                    this.submitted = true 
            
            
            if(Number(this.newBomID) >= 1)
            {
                let newBOM = await this.$axios.$get(`/bom_list/${this.newBomID}`)
                    let newBOMObject = newBOM[0]
                    this.newBOM = newBOMObject || {} 
            }  
        },

//---------------------------------CSV SUBMISSION----------------------------------------------------------

        handleFileUpload: function() {
            this.file = this.$refs.file.files[0];
        },

        async submitFile() {
            let formData = new FormData();
            
            formData.append('file', this.file);
            formData.append('bom_name', this.newBOM.bom_name);
            formData.append('type', 'C')

            let fileresponse = await this.uploadBomFile(formData);

            console.log("fileresponse =",fileresponse);

            await this.getBOM();
            

        },
        uploadBomFile(formData)
        {
            if((typeof formData !== 'undefined'))
            {
                //formData.bom_name = this.newBOM.bom_name
                return this.$axios.$post('/upload',
                        formData, //{formData, bom_name:'bom99'}, 
                        {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        //body: {bom_name:this.newBOM.bom_name}
                    }
                    ).then(function(response){
                console.log('SUCCESS!!');
                return response;
                }).catch(function(e){
                console.log('FAILURE!!');
                return e;
                });
            } else {
                return Promise.resolve({});
            }
        },
        //Gets the BOM of matching the name on the input
        async getBOM() {
            let bom = await this.$axios.$get(`/bom/${this.newBOM.bom_name}`)
            this.bom = bom;
            await this.pcbaIDFunction();
        },

        pcbaIDFunction() {
            for(let i=0; i<this.bom.length; i++) {
               this.pcbaID[i] = this.bom[i].idbom_comp 
            }
        },
///////////////////////////////////////////////////////////////////////////////////////////////////////////

    //CALLED BY FINISH BOM
    postBOM: function() {
        //let pcbaIndex = this.fig_items.length - 1;

        //typeof this.orderedBOM !== "undefined" &&
        //this.orderedBOM.hasOwnProperty("bom_name")

        for (let i = 0; i<this.item.length; i++) {
            for(let j = 0; j<this.items.length; j++) {
                if(typeof this.items[j] != "undefined" && this.items[j].hasOwnProperty("part_number")) {
                if (this.item[i] == this.items[j].part_number) {
                    this.actual_items[i] = this.items[j]
                    //console.log(this.items[j].id)
                }
                }
                else {
                    this.actual_items[i] = {}
                }
            }
        }

        
        for(let i = 0; i<this.actual_items.length; i++) {
            if(typeof this.actual_items[i] != "undefined" && this.actual_items[i].hasOwnProperty("part_number")) {
            this.$axios.$post("/bom", {
                    comp_name: this.actual_items[i].part_number,
                    bom_name: this.newBOM.bom_name,
                    idbom_comp: this.pcbaID[i], //idbom_comp: this.pcbaID[pcbaIndex],
                    comp_id: this.actual_items[i].id,
                    //type: this.type[i]
            }) 
            }
            else {
               this.$axios.$post("/bom", {
                    comp_name: null,
                    bom_name: this.newBOM.bom_name,
                    idbom_comp: this.pcbaID[i], //idbom_comp: this.pcbaID[pcbaIndex],
                    comp_id: null,
                    //type: this.type[i]
            })  
            }
        } 

        if(this.newFigItem.length > 0) {
            for(let i = 0; i<this.newFigItem.length; i++) {
                this.$axios.$post("/bomnew", {
                    cust_part_name: this.newCustNumber[i],
                    type: this.newType[i],
                    comp_name: this.newFigItem[i],
                    designator: this.newDesignator[i],
                    qty: this.newQuantity[i],
                    bom_name: this.newBOM.bom_name

                })
            }
        }
   },
      
        
    finishBOM: async function() {
        await this.postBOM();
        
        this.finishedNewBOM = await this.$axios.$get(`/bom/${this.newBOM.bom_name}`)
    
        this.finish = true
    }

     

},


created: async function() {
        
        //GETS RAW COMPONENTS FROM THE STORE
    let items =  await this.$axios.$get("/fig_items")
    this.items = items
 }

}


</script>

<style scoped>

* { box-sizing: border-box; }
body {
  font: 16px Arial;
}

.autocomplete {
  /*the container must be positioned relative:*/
  position: relative;
  display: inline-block;
 
}

.autocomplete-items {
  position: absolute;
  border: 1px solid #d4d4d4;
  border-bottom: none;
  border-top: none;
  z-index: 99;
  width: 300px;
  margin-left: 13%;

  /*position the autocomplete items to be the same width as the container:*/
  top: 70%;
  left: 0;
  right: 0;
}

.autocomplete-items li {
  padding: 5px;
  cursor: pointer;
  background-color: #fff;
  border-bottom: 1px solid #d4d4d4;
}

.autocomplete-items li:hover {

    background-color: #e9e9e9;
}

.autocomplete-items ul {
    list-style-type:none;
    padding: 0px;
    margin-left: 15px;
}

td {
    padding: 5px;
}

</style>