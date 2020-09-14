<template>
  <div>
    <div v-if="showOrderedBOM">
      <table style="background-color: ">
        <tbody>
          <tr>
            <td>
              <b>Job No:</b>
            </td>
            <td>
              <b>{{job.job_number}}</b>
            </td>
            <td class="empty-col"></td>
            <td>
              <b>Unit Price:</b>
            </td>
            <td>R{{bom_price.toFixed(2)}}</td>
            <td class="empty-col"></td>
            <td>
              <button v-on:click="createExcel">Export Shortages</button>
            </td>
          </tr>
          <tr>
            <td>
              <b>BOM:</b>
            </td>
            <td>{{orderedBOM.bom_name || ''}}</td>
            <td></td>
            <td>
              <b>Order Price:</b>
            </td>
            <td>R{{(orderedBOM.qty*bom_price).toFixed(2)}}</td>
            <td class="empty-col"></td>
            <td>
              <button v-on:click="count=!count">Add Item</button>
            </td>
          </tr>
          <tr>
            <td>
              <b>Ordered Qty:</b>
            </td>
            <td>{{orderedBOM.qty || '0'}}</td>
            <td></td>
            <td>
              <b>Lead-time:</b>
            </td>
            <td>{{lead_time}} Days</td>
            <td class="empty-col"></td>
            <td>{{shortage_list.length}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>No BOM</p>
    </div>

    <!--div>
    <JobStage/>
     <button v-on:click.prevent="addCount">Enter</button>
    </div-->

    <!--------------------------BOM TABLE----------------------------------------->
    <div id="preview" v-if="showOrderedBOM">
      <table class="table table-bordered table-hover grid" style="width:90%; font-size: 0.9em;">
        <thead style="background-color:#0066CC; color:white ">
          <tr>
            <th style="width:10px;">#</th>
            <th style="width:30px;">Item No</th>
            <th style="width:50px;">Type</th>
            <th style="width:1000px;">Component</th>
            <th style="width:200px;">Designator</th>
            <th style="width:100px;">BOM Qty</th>
            <th style="width:30px;">Stock Price</th>
            <th style="width:100px;">Wastage</th>
            <th style="width:100px;">Required Qty</th>
            <th style="width:30px;">Stock Qty</th>
            <th style="width:30px;">Supplier</th>
            <th style="width:30px;">Quote Qty</th>
            <th style="width:30px;">Lead-time</th>
            <th style="width:30px;">Price</th>
            <th v-if="!processed" style="width:30px;">Use</th>
          </tr>
        </thead>
        <tbody>
           <tr v-if="newItemB">
            <td>{{''}}</td>
            <td>{{''}}</td>
            <td><select style="width:50px;" v-model="newItem.type">
              <option value="M">M</option>
              <option value="C">C</option>
              <option value="Q">Q</option>
              </select>
            </td>
            <td><input list="items" style="width:200px;" v-model="newItem.name"></td>
            <datalist id="items">
            <option v-for="item in items" :key="item.id" >{{item.part_number}}</option>
            </datalist>
            <td><input type="text" style="width:80px;" v-model="newItem.designator"></td>
            <td><input type="text" style="width:50px;" v-model="newItem.bom_qty"></td>
            <td><input type="text" style="width:50px;" v-model="newItem.price"></td>
            <td><!--input type="text" style="width:50px;"--></td>
            <td><!--input type="text" style="width:50px;"--></td>
            <td><!--input type="text" style="width:50px;"--></td>
            <td><input type="text" style="width:130px;" v-model="newItem.supplier"></td>
            <td><input type="text" style="width:50px;" v-model="newItem.quote_qty"></td>
            <td><input type="text" style="width:50px;" v-model="newItem.lead_time"></td>
            <td><input type="text" style="width:50px;" v-model="newItem.quote_price"></td>
            <td><button v-on:click="addNew">Add</button></td>
          </tr>
          <tr
            v-for="(component, index) in sorted_items"
            :key="index"
            :class="{'shortage' : (shortages(component.comp_name, (component.bom_qty*orderedBOM.qty))<0)}"
            @contextmenu.prevent="$refs.menu.open"
          >
            <!-----v-if="(shortages(component.comp_id, (component.qty*orderedBOM.qty))>=0)"---->
            <td style="text-align: center;">{{index+1}}</td>
            <td style="text-align: center;">{{component.item_no}}</td>
          
            <td style="text-align: center;">{{component.type}}</td>
            <td>{{component.comp_name}}</td>
            <td>{{component.designator}}</td>
            <td>{{component.bom_qty}}</td>
            <td v-text="findItem(component.comp_name).price"></td>
            <td>{{''}}</td>
            <td v-if="(component.type == 'C') || (component.type == 'M') ">{{component.bom_qty*orderedBOM.qty}}</td>
            <td v-else>{{component.req_qty}}</td>
            <td v-text="findItem(component.comp_name).qty"></td>
            <td>{{component.supplier}}</td>
            <td>{{component.quoted_qty}}</td>
            <td>{{component.lead_time}}</td>
            <td>{{component.price}}</td>
            <td
              v-if="((component.quoted_qty>0) || (shortages(component.comp_name, (component.bom_qty*orderedBOM.qty))>0)) && !processed"
               style="text-align: center; vertical-align: middle;"
            >
              <input
                type="checkbox"
                v-bind:true-value="component"
                v-bind:false-value="undefined"
                v-model="checked_quotes[index]"
                v-on:change="Checked(checked_quotes[index])"
               
              />
            </td>
            <td v-else>{{''}}</td>
          </tr>
          
        </tbody>
      </table>
      <vue-context ref="menu" class="context-menu">
          <li @click.prevent="createExcel">Export Shortages</li>
          <li @click.prevent="showAll">Complete View</li>
          <li @click.prevent="hideQuotes">Hide Quotes</li>  
          <li @click.prevent="showSelected">Show Selected Items</li>
          <li @click.prevent="sortByItemNo">Sort by Item No</li>
          <li @click.prevent="newItemB = true">Add BOM Item</li>
          <li @click.prevent="minCost">Min Cost</li>
          <li @click.prevent="minLT">Min Lead-time</li>
          <nuxt-link to='/components/additem'><li>Add New Fig Item</li></nuxt-link>
          <li @click.prevent="updateBom">Update BOM</li>
          <li v-if="process" @click.prevent="processJob">Process Job</li>
          <!--li @click.prevent="onClick($event.target.innerText)">Do something else </li-->
      </vue-context>
      <button v-on:click="updateBom">Update Price & LT</button>
      <br />
      <br />
      <button v-on:click="generatePOs">Generate POs</button>
      <br />

      <!-------------------------  QUOTE UPLOAD  ---------------------------------------------------->
      <form class="border border-dark" style="width:60%;">
        <h4 class="text-center">Add Quote</h4>
        <div class="form-group">
          <label class="control-label col-sm-3">Supplier</label>
          <input type="text" v-model="quote_supplier" />
        </div>
        <div class="form-group">
          <label class="control-label col-sm-3">Quote Number</label>
          <input type="text" v-model="quote_number" />
        </div>

        <div class="form-group">
          <label class="control-label col-sm-3">Upload CSV Quote</label>
          <input type="file" accept=".csv" ref="file" v-on:change="handleFileUpload()" />
          <button v-on:click.prevent="submitFile()">Upload File</button>
        </div>
      </form>
    </div>
    <div v-else>
      <p>No BOM</p>
    </div>
  </div>
</template>

<script>
import XLSX from "xlsx";
import VueContext from 'vue-context';
//import '~vue-context/dist/css/vue-context.css';
export default {
  props: ["job", "ordered_boms"],
  components: { VueContext },

  data() {
    return {
      components: [],
      //items: [],
      stock_qty: [],
      ordered_bom: [],
      bom: {},
      actual_items: [],
      items: [],
      product: [],
      bom_price: 0,
      lead_time1: [],
      lead_time: 0,
      process: false,
      count: false,
      suppliers: [
        "TRX",
        "ConnectorTech",
        "Mantech",
        "EBV",
        "Digikey",
        "Arrow",
        "NewVision",
        "TT",
        "RS Components"
      ],
      quote_number: "",
      quote_lead_time: [],
      quote_supplier: "",
      quote_comp: [],
      shortage_list: [],
      real_list: [],
      show: false,
      showQuotes: false,
      quoted_items: [],
      sorted_items: [],
      checked_quotes: [],
      combined_bom: [],
      checked: false,
      made_bom: [],
      newItemB: false,
      newItem: {
        type: null,
        name: null,
        designator: null,
        bom_qty: null,
        price: null,
        supplier: null,
        quote_qty: null,
        lead_time: null,
        quote_price: null,
        bom_name: null
      },
      
      job_stages: [],
      processed: false,
      min_price: [],
      arrayPrice: [],
      arrayLeadTime: [],
      minCostObject: [],
      similarObject: [],
      min_lt: []
      //id: ordered_boms.idordered_boms
    };
  },
  watch: {
    "orderedBOM.bom_name": function(newVal, oldVal) {
      console.log("watch orderedBOM newVal =", newVal);
      this.getComponents(newVal);
    }
  },
  computed: {
    showOrderedBOM() {
      return typeof this.orderedBOM !== "undefined" &&
        this.orderedBOM.hasOwnProperty("idordered_boms")
        ? true
        : false;
    },
    orderedBOM() {
      return this.ordered_boms.find(
        v => v.idordered_boms == this.$route.params.iditem
      );
    },
    orderedQty() {}
  },

  methods: {
    getComps: function(i) {
      return this.stock_qty[i];
    },
    findItem(comp_name) {
      return this.items.find(v => v.part_number == comp_name) || {};
    },

    findBom(item_no) {
      return this.components.find(v => v.item_no == item_no) || {};
    },

    itemDescription(comp_name) {
      return this.findItem(comp_name).description;
    },

    mfgPartNumber(comp_id) {
      return this.findItem(comp_id).mfg_partnumber;
    },

    shortages(comp_name, orderQTY) {
      return this.findItem(comp_name).qty - orderQTY;
    },
    findComponents(comp_name) {
      //console.log(comp_name)
      //console.log(this.quoted_items)
      return this.components.find(v => v.comp_name == comp_name);
    },

    async getComponents(bomName) {
      if (typeof bomName !== "undefined") {
        this.components = await this.$axios.$get(`/bom/${bomName}`);
        //this.bom_fly = this.components
        return this.components;
      } else {
        this.components = [];
      }
    },

    generatePOs() {
      if (this.made_bom.length < this.components.length) {
        alert("Error: The number of selected items is than bom elements!");
      } else if (this.made_bom.length > this.components.length) {
        alert("Error: Some items have been selected more than once!");
      } else {
        alert("Success!");
      }
    },

    updateBom() {
     
      if (this.made_bom.length < this.components.length) {
        alert("Error: The number of selected items is less than bom elements!");
      } 
      else if (this.made_bom.length > this.components.length) {
        alert("Error: Some items have been selected more than once!");
      } 
      else {
       this.process = true;
       this.priceLTCalc()
       
        
      } 
    },

    priceLTCalc() {
      this.bom_price = 0
      this.lead_time1 = [0]
        for (let i = 0; i < this.made_bom.length; i++) {
          if(this.made_bom[i].type == 'C') {
            
            this.product[i] = this.findItem(this.made_bom[i].comp_name).price*this.made_bom[i].bom_qty
            this.lead_time1[i] = 0
            //alert('Type C')
          }
          if(this.made_bom[i].type == 'Q') {
            //alert('Type Q')
            this.product[i] = this.made_bom[i].price*this.findBom(this.made_bom[i].item_no).bom_qty
            this.lead_time1[i] = this.made_bom[i].lead_time
          }
          //this.product[i] = this.components[i].qty * this.actual_items[i].price;
          this.bom_price = this.bom_price + this.product[i];
          
        }

        this.lead_time = Math.max.apply(Math, this.lead_time1);
    },

    Checked(index) {
      this.made_bom = this.checked_quotes.filter(a => typeof a != "undefined");
      
    
      this.priceLTCalc()
    
      
     
    },

    async getQuotedItems() {
      this.quoted_items = await this.$axios.$get(
        `/quotes/${this.job.job_number}/${this.orderedBOM.bom_name}`
      );
      this.combined_bom = this.components.concat(this.quoted_items);
      this.sorted_items = this.combined_bom.sort((a, b) => {
        a.type > b.type ? 1 : -1
        a.comp_name > b.comp_name ? 1 : -1
      });
      //let similar_object = []
      let similar_prices = []
      let similar_leadtime = []
      for(let i = 0; i<this.components.length; i++) {
        this.components[i].item_no = i+1
        
        similar_prices = []
        similar_leadtime =  []
        for(let j = 0; j<this.quoted_items.length; j++) {
            if(this.quoted_items[j].comp_name == this.components[i].comp_name) {
              this.quoted_items[j].item_no = i+1;
              similar_prices.push(this.quoted_items[j].price)
              similar_leadtime.push(this.quoted_items[j].lead_time)
            }
            /*
            else {
              similar_prices.push(this.findItem(this.components[i].comp_name).price)
            }*/
        }
        if(similar_prices.length>0) {
        this.arrayPrice.push(similar_prices)
        this.arrayLeadTime.push(similar_leadtime)
        }
        else { //If item is stock find it's price
          similar_prices.push(this.findItem(this.components[i].comp_name).price)
          similar_leadtime.push(0);
          this.arrayPrice.push(similar_prices)
          this.arrayLeadTime.push(similar_leadtime)
        }
      }
      
    },

    onClick(text) {
            alert(`You clicked on: "${text}"`);
        },

    hideQuotes() {
      this.combined_bom = this.combined_bom.filter(a => a.type == 'C')
    },

    showAll(){
      this.combined_bom = this.components.concat(this.quoted_items);
      this.sorted_items = this.combined_bom.sort((a, b) => {
        
        a.type > b.type ? 1 : -1
        a.comp_name > b.comp_name ? 1 : -1
      }
      );
      
    },

    sortByItemNo() {
      //this.combined_bom = this.components.concat(this.quoted_items);
      this.sorted_items = this.combined_bom.sort((a, b) => 
        (a.item_no > b.item_no)? 1 : (a.item_no === b.item_no) ? ((a.type > b.type) ? 1 : -1) : -1);
    },


    showSelected() {
      this.combined_bom = this.made_bom
    },

    minCost() {
      this.bom_price = 0
      for(let i = 0; i<this.arrayPrice.length; i++) {
        
          this.min_price.push(Math.min.apply(Math, this.arrayPrice[i]))
          let min = Math.min.apply(Math, this.arrayPrice[i])
          let min_index = (this.arrayPrice[i].indexOf(min))
          
          this.product[i] = this.min_price[i]*this.components[i].bom_qty
          this.lead_time1[i] = this.arrayLeadTime[i][min_index]
          this.bom_price = this.bom_price + this.product[i];
        
      }
      this.lead_time = Math.max.apply(Math, this.lead_time1)
    },

    minLT() {
      this.bom_price = 0
      for(let i = 0; i<this.arrayLeadTime.length; i++) {
          this.min_lt.push(Math.min.apply(Math, this.arrayLeadTime[i]))
          let min = Math.min.apply(Math, this.arrayLeadTime[i])
          let min_index = this.arrayLeadTime[i].indexOf(min)
          this.product[i] = this.arrayPrice[i][min_index]*this.components[i].bom_qty
          this.bom_price = this.bom_price + this.product[i];

      }
      this.lead_time = Math.max.apply(Math, this.min_lt)
    },

    async processJob() {
      
      for(let i = 0; i<this.made_bom.length; i++) {
        if(this.made_bom[i].type == 'Q') {
          //used = yes
          //po number = this.job_number+supplier-code
          await this.$axios.$post(`/usedquotes`, {
                            po_number: `${this.job.job_number}-${this.made_bom[i].supplier}`,
                            idquotes: this.made_bom[i].idquotes})
          

          //this.quoted_items[i] = await this.$axios.$get(`/usedquotes/${this.orderedBOM.bom_name}/${this.job.job_number}-${this.made_bom[i].supplier}`)
        }
      }
      
    
      
    },

    getUsedQuotes() {
      
    },

    createExcel() {
      //var table = XLSX.utils.table_to_sheet(document.getElementById('shortages'))
      for (let i = 0; i < this.shortage_list.length; i++) {
        if (typeof this.shortage_list[i] == "undefined") {
          //this.real_list[i] = this.shortage_list[i]
          this.shortage_list.splice(i, 1);
        }
      }

      var sheet = XLSX.utils.json_to_sheet(this.shortage_list);

      var wb = XLSX.utils.book_new();

      //XLSX.utils.book_append_sheet(wb, table, `${this.orderedBOM.bom_name}`) // sheetAName is name of Worksheet

      XLSX.utils.book_append_sheet(wb, sheet, `${this.orderedBOM.bom_name}`);

      // export Excel file
      XLSX.writeFile(
        wb,
        `QT${this.job.job_number}-${this.orderedBOM.bom_name}.csv`
      ); // name of the file is 'book.xlsx'
    },
    /****************************************   QUOTE UPLOAD  *************************************/

    handleFileUpload: function() {
      this.file = this.$refs.file.files[0];
    },

    async submitFile() {
      let formData = new FormData();

      formData.append("file", this.file);
      formData.append("quote_supplier", this.quote_supplier);
      formData.append("quote_number", this.quote_number);
      formData.append("job_number", this.job.job_number);
      formData.append("bom_name", this.orderedBOM.bom_name);
      formData.append("type", "Q");
      //formData.append("req_qty", this.component.bom_qty*this.orderedBOM.qty)

      let fileresponse = await this.uploadQuoteFile(formData);

      console.log("fileresponse =", fileresponse);

      await this.getQuotedItems();
    },
    uploadQuoteFile(formData) {
      if (typeof formData !== "undefined") {
        return this.$axios
          .$post("/uploadquote", formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(function(response) {
            console.log("SUCCESS!!");
            return response;
          })
          .catch(function(e) {
            console.log("FAILURE!!");
            return e;
          });
      } else {
        return Promise.resolve({});
      }
    },

    async addNew() {
      this.newItem.bom_name = this.orderedBOM.bom_name
      await this.$axios.$post("/bomupdate", this.newItem)
      this.newItemB = false
      await this.getComponents(this.orderedBOM.bom_name)
    },

    shortageList() {
      for (let i = 0; i < this.components.length; i++) {
      if (
        this.actual_items[i].qty <
        this.orderedBOM.qty * this.components[i].bom_qty
      ) {
        this.shortage_list[i] = {};
        this.shortage_list[i].part_number = this.actual_items[i].part_number;
        this.shortage_list[i].description = this.actual_items[i].description;
        this.shortage_list[i].mfg_partnumber = this.actual_items[
          i
        ].mfg_partnumber;
        this.shortage_list[i].required_qty =
          this.components[i].bom_qty * this.orderedBOM.qty -
          this.actual_items[i].qty;
        this.shortage_list[i].price = "";
        this.shortage_list[i].qty = "";
        this.shortage_list[i].lead_time = "";

        if (typeof this.shortage_list[i] == "undefined") {
          this.shortage_list.splice(i, 1);
        }
      }
    }
    }

  },

  created: async function() {
    //console.log(this.$route.params.idordered_boms)

    if (
      typeof this.orderedBOM !== "undefined" &&
      this.orderedBOM.hasOwnProperty("bom_name")
    ) {
      this.getComponents(this.orderedBOM.bom_name);
    }

    let items = await this.$axios.$get("/fig_items");
    this.items = items;

    for (let i = 0; i < this.components.length; i++) {
      for (let j = 0; j < this.items.length; j++) {
        if (this.components[i].comp_name == this.items[j].part_number) {
          this.actual_items[i] = this.items[j];
          //console.log(this.items[j].id)
        }
      }
    }

    console.log("created this.orderedBOM =", this.orderedBOM);

  //debugger 
  if(this.actual_items.length > 0) {

  await this.shortageList()


  await this.getQuotedItems(); 
  }
  else {
    alert("Some BOM items are not matched with Fig Item Codes")
  }
    
    
  }
};
</script>

<style scoped>
input[type="text"] {
  width: 250px;
}

select {
  padding: 5px;
}

td {
  padding: 5px;
}

.empty-col {
  width: 100px;
}

.shortage {
  background-color: lightsalmon;
}

th {
  vertical-align: middle;
}

li {
  list-style-type: none;
  margin-left: -30px;
  padding: 0px;
}



.context-menu {
  position:fixed;
  z-index: 10000;
  width: 200px;
  background: rgb(230, 220, 220);
}

.context-menu :hover {
  background: rgb(0, 162, 255);
}

</style>