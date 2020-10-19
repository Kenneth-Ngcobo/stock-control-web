<template>
  <div>
    <div v-if="showOrderedBOM">
<!---------------------------------  BOM DETAILS  -------------------------------------------------------------------->
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
            <td><button v-on:click="add_quote = true">Add Quote</button></td>
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
            <td><button v-on:click="add_item = true">Add Item</button></td>
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
          
          </tr>
        </tbody>
      </table>
<!---------------------------------  NO BOM  ---------------------------------------------------------------------->
    </div>
    <div v-else>
      <p>No BOM</p>
    </div>

<div id="preview" v-if="showOrderedBOM">
<!---------------------------------  OLD BOM TABLE--------------------------------------------------------------->
      <table class="table table-bordered table-hover grid" style="width:auto; font-size: 0.9em;">
        <thead style="background-color:#0066CC; color:white ">
          <tr>
            <th style="width:auto; text-align: center; vertical-align: middle;">Quote  <input type="checkbox" @click="selectAll" v-model="allSelected"></th>
            <th style="width:auto;">#</th>
            <th style="width:auto;">Item No</th>
            <th style="width:auto;">Type</th>
            <th style="width:auto;">Component</th>
            <th style="width:auto;">Designator</th>
            <th style="width:auto;">BOM Qty</th>
            <th style="width:auto;">Stock Price</th>
            <th style="width:auto;">Wastage</th>
            <th style="width:auto;">Required Qty</th>
            <th style="width:auto;">Stock Qty</th>
            <th style="width:auto;">Supplier</th>
            <th style="width:auto;">Quote Qty</th>
            <th style="width:auto;">Lead-time</th>
            <th style="width:auto;">Price</th>
            <th v-if="!processed" style="width:auto;">Use</th>
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
            <td><input type="text" style="width:130px;" v-model="newItem.supplier"></td>
            <td><input type="text" style="width:50px;" v-model="newItem.quote_qty"></td>
            <td><input type="text" style="width:50px;" v-model="newItem.lead_time"></td>
            <td><input type="text" style="width:50px;" v-model="newItem.quote_price"></td>
            <td><button v-on:click="addNew">Add</button></td>
          </tr>
          <tr
            v-for="(component, index) in sorted_items"
            :key="component.idbom_comp"
            :class="{'shortage' : (shortages(component.comp_name, (component.bom_qty*orderedBOM.qty))<0), 'unfound' : component.comp_name == null}"
  
            @contextmenu.prevent="$refs.menu.open($event, { name: component.comp_name, idbom_comp: component.idbom_comp})"
          >
          
            <td style="text-align: center; vertical-align: middle;" 
            v-if="(shortages(component.comp_name, (component.bom_qty*orderedBOM.qty))<0)">
            <input type="checkbox"
              :id="component.idbom_comp"
              :value="component"
              v-model="items_to_quote"
            ></td>                             
            <td v-else>{{''}}</td>
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
                :value="component"
                v-model="checked_quotes"
                v-on:change="Checked(checked_quotes[index])"
                
              />
            </td>
            <td v-else>{{''}}</td>
          </tr>
          
        </tbody>
      </table>
<!--------------------------------------------------------------------------------------------------------------------------->
  <br>
<!---------------------------------  NEW BOM TABLE ------------------------------------------------------------------->
  <no-ssr id="bom-table" placeholder="Loading...">
   <v-client-table :data="sorted_items" :columns="columns" :options="options" name="bomtable" style="font-size: 0.9em;">
  <!-- <span slot="child_row" slot-scope="props"
   @contextmenu.prevent="$refs.menu.open"
   :class="{'shortage' : (shortages(props.row.comp_name, (props.row.bom_qty*orderedBOM.qty))<0)}"
   ></span>
   -->

   <!--span slot="afterFilter" slot-scope="{row}" v-on:click="rowMethod(row)">{{row.item_no}} </span--> 
   

     <span slot="Quote" slot-scope="{row}" v-if="(shortages(row.comp_name, (row.bom_qty*orderedBOM.qty))<0)"
     style="margin-left: auto; margin-right: auto;">
       <input type="checkbox"
              :id="row.idbom_comp"
              :value="row"
              v-model="items_to_quote"
            >
     </span>
     <span slot="#" slot-scope="props">{{props.index}}</span>
    

     <div slot="comp_name" slot-scope="{row, update, setEditing, isEditing, revertValue}" @contextmenu.prevent="$refs.menu.open($event, { name: row.comp_name, idbom_comp: row.idbom_comp})">
      <span @click="setEditing(true)" v-if="!isEditing()">
        <a>{{row.comp_name}}</a>
      </span>
      <span v-else>
        <input type="text" v-model="row.comp_name">
        <button type="button" class="btn btn-info btn-xs" @click="update(row.comp_name); setEditing(false)">Submit</button>
       <button type="button" class="btn btn-default btn-xs" @click="revertValue(); setEditing(false)">Cancel</button>
      
      </span>

    </div>
     <span slot="columns" @contextmenu.prevent="$refs.menu2.open"></span>

    <template slot="VtTableRow" slot-scope="props">

      <div @contextmenu.prevent="$refs.menu2.open" >
           {{props.formattedRow[props.column.field]}}
       </div> 

    </template>

     <span slot="stock_price" slot-scope="{row}" v-text="findItem(row.comp_name).price"></span> 
     <span slot="req_qty" slot-scope="{row}" v-if="(row.type == 'C') || (row.type == 'M') ">{{row.bom_qty*orderedBOM.qty}}</span>
     <span slot="req_qty" slot-scope="{row}" v-else>{{row.req_qty}}</span>
     <span slot="stock_qty" slot-scope="{row}" v-text="findItem(row.comp_name).qty"></span>
     <span slot="Use" slot-scope="{row}" v-if="((row.quoted_qty>0) || (shortages(row.comp_name, (row.bom_qty*orderedBOM.qty))>0)) && !processed"
      style="text-align: center; vertical-align: middle;"><input
                type="checkbox"
                :value="row"
                v-model="checked_quotes"
                v-on:change="Checked(checked_quotes[index])"
               />
     </span>
    
   </v-client-table>
  </no-ssr>

<!---------------------------------  CONTEXT MENU  -------------------------------------------->
      <vue-context ref="menu" class="context-menu" v-slot="{ data }">
         <template v-if="data">
          <li @click.prevent="onClick(data.name, data.idbom_comp)">Edit Item</li>
          <li @click.prevent="selectAll">Select All Shortages</li>
          <li @click.prevent="unselectAll">Unselect All Shortages</li>
          <li v-if="items_to_quote.length>0" @click.prevent="exportQuotes">Export Quotes</li>
          <li @click.prevent="add_quote = true">Add Quote</li>
          <li @click.prevent="createExcel">Export Shortages</li>
          <li @click.prevent="showAll">Complete View</li>
          <li @click.prevent="hideQuotes">Hide Quotes</li>  
          <li @click.prevent="showSelected">Show Selected Items</li>
          <li @click.prevent="sortByItemNo">Sort by Item No</li>
          <li @click.prevent="newItemB = true">Add BOM Item</li>
          <li @click.prevent="minCost">Min Cost</li>
          <li @click.prevent="minLT">Shortest Lead-time</li>
          <nuxt-link to='/components/additem'><li>Add New Fig Item</li></nuxt-link>
          <li @click.prevent="updateBom">Update BOM</li>
          <li v-if="process" @click.prevent="processJob">Process Job</li>
          <!--li @click.prevent="onClick($event.target.innerText)">Do something else </li-->
         </template>

         <template v-else>
           <li>Test</li>
           <li>Test</li>
           <li>Test</li>
           <li>Test</li>
           <li>Test</li>
         </template>
      </vue-context>


      <vue-context ref="menu2" class="context-menu">
          <li>Test</li>
          <li>Test</li>
          <li>Test</li>
          <li>Test</li>
          <li>Test</li>
      </vue-context>
      
<!---------------------------------  QUOTE UPLOAD MODAL  ---------------------------------------------------->
      <div v-if="add_quote" id="myModal" class="modal" >

      <div class="modal_backdrop" @click="add_quote = false"/>

      <form class="border border-dark modal-content" style="width:60%;" >
        <div class="form-group">
          <h4 class="text-center">Add Quote</h4>
          <button v-on:click="add_quote = false" class="close">&times;</button>
        </div>
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
<!---------------------------------  ADD NEW ITEM MODAL  ---------------------------------------------------------------------------------->
    <div v-if="add_item" id="myModal" class="modal" >

      <div class="modal_backdrop" @click="add_item = false"/>

      <form class="border border-dark modal-content" style="width:60%;" >
        <div class="form-group">
          <h4 class="text-center">Add Item</h4>
          <button v-on:click="add_item = false; newItem.name = null; newItem.type = null; req_guide = false" class="close">&times;</button>
        </div>

        <div class="form-group">
          <label class="control-label col-sm-3">Item Type</label>
          <select style="width: 400px" v-model="newItem.type">
            <option value="" selected disabled hidden>Select item type</option>
            <option value="M">M</option>
            <option value="C">C</option>
            <option value="Q">Q</option> 
          </select>
        </div>

        <div class="form-group">
          <label class="control-label col-sm-3">Part Number</label>
          <input id="list" list="items" autocomplete="off" v-model="newItem.name" :onchange="autoFill(newItem.name)" />
        </div>
        <datalist id="items">
            <span v-if="newItem.type == 'Q'">
            <option v-for="item in shortage_list" :key="item.id" >{{item.comp_name}}</option>
            </span>
            <span v-else>
            <option v-for="item in items" :key="item.id" >{{item.part_number}}</option>
            </span>
        </datalist>
        <div class="form-group">
          <label class="control-label col-sm-3">Description</label>
          <input type="text" v-model="newItem.description" />
        </div>
        <div class="form-group" v-if="newItem.type != 'Q'">
          <label class="control-label col-sm-3">Designator</label>
          <input type="text" v-model="newItem.designator" />
        </div>
        <div class="form-group" v-else>
          <label class="control-label col-sm-3">Supplier</label>
          <input type="text" v-model="newItem.supplier" />
        </div>
        <div class="form-group" v-if="newItem.type != 'Q'">
          <label class="control-label col-sm-3">BOM Qty</label>
          <input type="text" v-model="newItem.bom_qty" />
        </div>
        <div class="form-group" v-else>
          <label class="control-label col-sm-3">Lead-time</label>
          <input type="text" v-model="newItem.lead_time" />
        </div>
        <div class="form-group" v-if="newItem.type == 'Q'">
          <label class="control-label col-sm-3" id="expLabel" tabindex="-1" >Quote Qty</label>
          <input type="text" v-model="newItem.quoted_qty" aria-labelledby="expLabel expDesc" @focus="req_guide = true"/>
          <div style="margin-left:26%" v-if="newItem.type == 'Q' && req_guide">
          <span id="expDesc" tabindex="-1" >required order qty: {{findComponents(newItem.name).bom_qty*orderedBOM.qty-findItem(newItem.name).qty}}</span>
          </div>
        </div>
        <div class="form-group" v-if="newItem.type == 'Q'">
          <label class="control-label col-sm-3">Quote Number</label>
          <input type="text" v-model="newItem.quote_number" />
        </div>
        <!--div class="form-group" v-if="newItem.type == 'Q' && newItem.stock_qty != null">
          <label class="control-label col-sm-3">Req Qty</label>
          <span v-text="findComponents(newItem.name).bom_qty*orderedBOM.qty-findItem(newItem.name).qty"></span>
        </div-->
        <div class="form-group">
          <label class="control-label col-sm-3">Item Cost</label>
          <input type="text" v-model="newItem.price" :placeholder="newItem.auto_price" />
        </div>
        <div class="form-group" v-if="newItem.stock_qty != null">
        <label class="control-label col-sm-3">Stock</label>
        {{newItem.stock_qty}}
        </div>

       <button id="additem" v-on:click.prevent="addItem()">Add Item</button>
      </form>
    
      </div>
<!------------------------------------------------------------------------------------------------------------------------------->
</div> <!----- END OF V-IF SHOWBOM -------->
    <div v-else>
      <p>No BOM</p>
    </div>
</div>
</template>

<script>
import XLSX from "xlsx";
import VueContext from 'vue-context';
import { ServerTable, ClientTable } from 'vue-tables-2';
/*const defaultTableOpt = {
    skin: 'table table-hover',
    sortIcon: {
    is: 'fa-sort',
    base: 'fas',
    up: 'fa-sort-up',
    down: 'fa-sort-down',
   
  }
};*/

export default {
  middleware: ['auth'],
  props: ["job", "ordered_boms"],
  components: { VueContext,  ClientTable },

  data() {
    return {
/********************************************************** */
      file: [],
      components: [],
      //items: [],
      stock_qty: [],
      ordered_bom: [],
      //ordered_boms: [],
      bom: {},
      bomQty: 0,
      this_bom: {},
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
        description: null,
        designator: null,
        bom_qty: null,
        stock_qty: null,
        price: null,
        auto_price: null,
        supplier: null,
        quoted_qty: null,
        quote_number: null,
        lead_time: null,
        quote_price: null,
        bom_name: null
      },
      
      job_stages: [],
      processed: false,
      min_price: [],
      arrayPrice: [],
      arrayLeadTime: [],
      arrayProducts: [],
      minCostObject: [],
      similarObject: [],
      min_lt: [],
      add_quote: false,
      add_item: false,
      booleanValue: true,
      items_to_quote: [],
      allSelected: false,
      req_quide: false,
      add_description: false,
/************ NORMAL DATA ********************* */
      //id: ordered_boms.idordered_boms
      columns: ['Quote', '#', 'item_no', 'type', 'comp_name', 'designator', 'bom_qty', 'stock_price', 'wastage', 'req_qty', 'stock_qty', 'supplier', 'quoted_qty', 'lead_time', 'price', 'Use'],
      options: {
            headings: {item_no: 'Item No', type: 'Type', comp_name: 'Component', designator: 'Designator', bom_qty: 'BOM Qty', price: 'Stock Price', req_qty: 'Required Qty', supplier: 'Supplier', quoted_qty: 'Quoted Qty', lead_time: 'Lead-Time', price: 'Price'},
            columnsDropdown: true,
            saveState: true,
            dateFormat: 'DD/MM/YYYY',
            texts: {
              filterPlaceholder: 'Search BOM',
              size: 10
            },
            editableColumns:['comp_name'],

            rowClassCallback: (row) => {
              
              if(row.hasOwnProperty('type'))
              {
                if(row.type == 'C')
                {
                  
                  //return (this.shortages(row.comp_name, (row.bom_qty*this.orderedBOM.qty))<0) ? 'shortage' : ''
                  if(this.shortages(row.comp_name, (row.bom_qty*this.orderedBOM.qty))<0) {
                    return 'shortage'
                  }

                  if(row.comp_name == null) {
                    return 'unfound'
                  }
                }

              }
              return ''
            },

            rowAttributesCallback: (row) => {
              // console.log('row.id = ',row.id)
               //@contextmenu.prevent="$refs.menu.open($event, { name: row.comp_name, idbom_comp: row.idbom_comp})"
               //this.$refs.menu2.open//(this.$event, { name: row.comp_name, idbom_comp: row.idbom_comp})
            },

            sortIcon: {
              base : 'fas',
              is: 'fa-sort',
              up: 'fa-sort-asc',
              down: 'fa-sort-desc'
            }

        }
    };
  },
  watch: {
    "orderedBOM.bom_name": function(newVal, oldVal) {
      console.log("watch orderedBOM newVal =", newVal);
      this.getComponents(newVal);
    }
  },
  computed: {

    orderedBOM() {
      return this.ordered_boms.find(
        v => v.idordered_boms == this.$route.params.iditem
      );
    },

    openMenu($event, row) {
      this.$refs.menu2.open
    },

    showOrderedBOM() {
      return typeof this.orderedBOM !== "undefined" &&
        this.orderedBOM.hasOwnProperty("idordered_boms")
        ? true
        : false;
    },
    
    orderedQty() {}
  },

  methods: {

    getBom() {
      this.this_bom = this.ordered_boms.find(v => v.idordered_boms == this.$route.params.iditem);
    },

    autoFill(name) {
        //console.log(name)
        if(this.findItem(name).id != undefined) {
        this.newItem.auto_price = this.findItem(name).price
        this.newItem.stock_qty = this.findItem(name).qty
        this.newItem.description = this.findItem(name).description
        }
        
    },

     async addItem() {
      if(this.newItem.type == 'Q') {
        console.log('Item type = Q')
        console.log('req qty = ',this.findComponents(this.newItem.name).bom_qty*this.orderedBOM.qty-this.findItem(this.newItem.name).qty)
        await this.$axios.$post('/quotes_single', {
          comp_name: this.newItem.name,
          req_qty: this.findComponents(this.newItem.name).bom_qty*this.orderedBOM.qty-this.findItem(this.newItem.name).qty,
          price: this.newItem.price,
          quoted_qty: this.newItem.quoted_qty,
          lead_time: this.newItem.lead_time,
          supplier: this.newItem.supplier,
          quote_number: this.newItem.quote_number,
          job_number: this.job.job_number,
          bom_name: this.orderedBOM.bom_name,
          type: this.newItem.type

        })
        await this.getQuotedItems();
      }
      else {

        console.log('This find item comp_id = ', this.findItem(this.newItem.name).id)
        if(this.findItem(this.newItem.name).id != undefined) {
          await this.$axios.$post('/bom', {
          comp_name: this.newItem.name,
          description: this.findItem(this.newItem.name).description,
          designator: this.newItem.designator,
          bom_qty: this.newItem.bom_qty,
          comp_id: this.findItem(this.newItem.name).id,
          bom_name: this.orderedBOM.bom_name,
          type: this.newItem.type

        })
        }
        else {
          console.log("Item not on the database")
        }
        /*
        let item_description = this.findItem(this.newItem.name).description
        console.log('Item type = ', this.newItem.type)
        console.log('item description', this.findItem(this.newItem.name).description)
        console.log('comp id = ', this.findItem(this.newItem.name).id )
        */
        /*this.$axios.$post('/bom', {
          comp_name: this.newItem.name,
          description: this.findItem(this.newItem.name).description,
          designator: this.newItem.designator,
          bom_qty: this.newItem.bom_qty,
          comp_id: this.findItem(this.newItem.name).id,
          bom_name: this.orderedBOM.bom_name,
          type: this.newItem.type

        })*/
      }
      this.add_item = false
      this.newItem.name = null
      this.newItem.type = null
      this.newItem.price = null
      this.req_quide = false

    },

    rowMethod(row){
       console.log('Im clicked')
       console.log('row.id = ',row.id)
    },
    getComps: function(i) {
      return this.stock_qty[i];
    },
    findItem(comp_name) {
      return this.items.find(v => v.part_number == comp_name) || {};
    },

    findBom(item_no) {
      return this.components.find(v => v.item_no == item_no) || {};
    },

    findQuote(idquotes) {
      return this.quoted_items.find(q => q.idquotes == idquotes) || {};
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
      return this.components.find(v => v.comp_name == comp_name) || {};
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
      let similar_products = []
      for(let i = 0; i<this.components.length; i++) {
        this.components[i].item_no = i+1               //Gives original BOM components an item number
        
        similar_prices = []
        similar_leadtime =  []
        similar_products = []
        for(let j = 0; j<this.quoted_items.length; j++) {
            if(this.quoted_items[j].comp_name == this.components[i].comp_name) {
              this.quoted_items[j].item_no = i+1;      //Gives quoted items of similar name the same item number
              similar_prices.push(this.quoted_items[j].price) //Prices of similar items are grouped in an array
              similar_leadtime.push(this.quoted_items[j].lead_time) //Lead time of similar items are grouped in an array
              similar_products.push(this.findQuote(this.quoted_items[j].idquotes))
            }
            /*
            else {
              similar_prices.push(this.findItem(this.components[i].comp_name).price)
            }*/
        }
        if(similar_prices.length>0) { //If the items are quoted, push similar prices array into a price array
        this.arrayPrice.push(similar_prices)
        this.arrayLeadTime.push(similar_leadtime)
        this.arrayProducts.push(similar_products)
        }
        else { //If item is in stock find its price
          similar_prices.push(this.findItem(this.components[i].comp_name).price)
          similar_leadtime.push(0); //zero lead-time for stock items
          similar_products.push(this.findComponents(this.components[i].comp_name))
          this.arrayPrice.push(similar_prices) //Push stock item price and lead-time to price & lt arrays
          this.arrayLeadTime.push(similar_leadtime)
          this.arrayProducts.push(similar_products)
        }
      }
      
    },

    onClick(name, idbom_comp) {
          if(name != null) {
            alert(`You clicked on: "${name}"`);
          }
          else {
            alert(`You clicked on component id: "${idbom_comp}"`)
          }
        },

    hideQuotes() {
      this.sorted_items = this.sorted_items.filter(a => a.type == 'C')
    },

    showAll(){
      //this.bom_price = 0
      //this.min_price = []
      //this.min_lt = []
      //this.lead_time = 0
      this.combined_bom = this.components.concat(this.quoted_items);
      this.sorted_items = this.combined_bom.sort((a, b) => 
        (a.item_no > b.item_no)? 1 : (a.item_no === b.item_no) ? ((a.type > b.type) ? 1 : -1) : -1);
     /* this.sorted_items = this.combined_bom.sort((a, b) => {
        a.type > b.type ? 1 : -1
        a.comp_name > b.comp_name ? 1 : -1
      }
      );*/
      
    },

    sortByItemNo() {
      //this.combined_bom = this.components.concat(this.quoted_items);
      this.sorted_items = this.combined_bom.sort((a, b) => 
        (a.item_no > b.item_no)? 1 : (a.item_no === b.item_no) ? ((a.type > b.type) ? 1 : -1) : -1);
    },


    showSelected() {
      this.sorted_items = this.made_bom
    },

    minCost() {
      this.bom_price = 0
      this.min_price = []
  
      for(let i = 0; i<this.arrayPrice.length; i++) {
        
          this.min_price.push(Math.min.apply(Math, this.arrayPrice[i]))
          let min = Math.min.apply(Math, this.arrayPrice[i])
          let min_index = (this.arrayPrice[i].indexOf(min))
          
          this.product[i] = this.min_price[i]*this.components[i].bom_qty
          this.lead_time1[i] = this.arrayLeadTime[i][min_index]
          this.made_bom[i] = this.arrayProducts[i][min_index]
          this.made_bom[i].designator = this.components.find(comp => comp.comp_name == this.arrayProducts[i][min_index].comp_name).designator
          this.checked_quotes[i] = this.arrayProducts[i][min_index]
          this.bom_price = this.bom_price + this.product[i];
        
      }
      this.lead_time = Math.max.apply(Math, this.lead_time1)
      this.process = true;
      //this.sorted_items = this.made_bom
    },

    minLT() {
      this.bom_price = 0
      this.min_lt = []
      for(let i = 0; i<this.arrayLeadTime.length; i++) {
          this.min_lt.push(Math.min.apply(Math, this.arrayLeadTime[i]))
          let min = Math.min.apply(Math, this.arrayLeadTime[i])
          let min_index = this.arrayLeadTime[i].indexOf(min)
          this.product[i] = this.arrayPrice[i][min_index]*this.components[i].bom_qty
          this.made_bom[i] = this.arrayProducts[i][min_index]
          this.made_bom[i].designator = this.components.find(comp => comp.comp_name == this.arrayProducts[i][min_index].comp_name).designator
          this.checked_quotes[i] = this.arrayProducts[i][min_index]
          this.bom_price = this.bom_price + this.product[i];

      }
      this.lead_time = Math.max.apply(Math, this.min_lt)
      this.process = true;
      //this.sorted_items = this.made_bom
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

      this.add_quote = false

      //console.log("fileresponse =", fileresponse);

      //SEND STATUS TO JOB AS QUOTED

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
      let short = []
      for (let i = 0; i < this.components.length; i++) {
      if(typeof this.actual_items[i] != 'undefined' && this.actual_items[i].hasOwnProperty("qty")) {
      if (this.actual_items[i].qty < this.orderedBOM.qty * this.components[i].bom_qty) {
        /*
        short[i] = {};
        short[i].part_number = this.actual_items[i].part_number;
        short[i].description = this.actual_items[i].description;
        short[i].mfg_partnumber = this.actual_items[i].mfg_partnumber;
        short[i].required_qty =this.components[i].bom_qty * this.orderedBOM.qty - this.actual_items[i].qty;
        short[i].price = "";
        short[i].qty = "";
        short[i].lead_time = "";
        */
       this.shortage_list.push(this.components[i])

      }
      }
      }
      /*
      if (typeof short[i] != "undefined") {
          this.shortage_list.push(short[i])
        } 
      */
    },

    selectAll() {
      if(!this.allSelected) {
        this.items_to_quote = this.shortage_list
      }
      else {
        this.items_to_quote = []
      }
    },

    unselectAll() {
        this.items_to_quote = []
    },

   

    exportQuotes() {
      let quote = this.items_to_quote.filter(a => typeof a != "undefined");
      let formated_quote = []
      for(let i = 0; i<quote.length; i++) {
          formated_quote[i] = {}
          formated_quote[i].part_number = this.findItem(quote[i].comp_name).part_number
          formated_quote[i].description = this.findItem(quote[i].comp_name).description
          formated_quote[i].mfg_partnumber = this.findItem(quote[i].comp_name).mfg_partnumber
          formated_quote[i].required_qty = quote[i].bom_qty*this.orderedBOM.qty-this.findItem(quote[i].comp_name).qty
          formated_quote[i].price = "";
          formated_quote[i].qty = "";
          formated_quote[i].lead_time = "";
      }
      var sheet = XLSX.utils.json_to_sheet(formated_quote);
      var wb = XLSX.utils.book_new();
      //XLSX.utils.book_append_sheet(wb, table, `${this.orderedBOM.bom_name}`) // sheetAName is name of Worksheet
      XLSX.utils.book_append_sheet(wb, sheet, `${this.orderedBOM.bom_name}`);
      // export Excel file
      XLSX.writeFile(
        wb,
        `QT${this.job.job_number}-${this.orderedBOM.bom_name}.csv`
      ); // name of the file is 'book.xlsx'
    },

    async checkBOM() { //CREATED

      if (typeof this.orderedBOM !== "undefined") {
      

      if(this.orderedBOM.hasOwnProperty("qty"))
      {
        this.bomQty = this.orderedBOM.qty || 0;
      }

      if(this.orderedBOM.hasOwnProperty("bom_name"))
      {
       await this.getComponents(this.orderedBOM.bom_name);
      }
      
    }

    },

   async getActualItems() { //CREATED
        for (let i = 0; i < this.components.length; i++) {
        for (let j = 0; j < this.items.length; j++) {
        if(this.components[i].hasOwnProperty("comp_name")) {
        if (this.components[i].comp_name == this.items[j].part_number) {
          this.actual_items[i] = (this.items[j]);
        }
      }
      else {
        this.actual_items[i] = (this.components[i])
      }
      }
    }
    },

    async checks() { //CREATED
      if(this.actual_items.length == 0) { //this.actual_items.length > 0

         await this.getActualItems() 
         console.log('Actual Items', this.actual_items)
      
    }
    else {
      //alert("Some BOM items are not matched with Fig Item Codes")
      await this.shortageList()


      await this.getQuotedItems(); 
    }
    }

  },

  created: async function() {
    //console.log(this.$route.params.idordered_boms)
    //this.ordered_boms = await this.$axios.$get(`/ordered_boms/${this.job.job_number}`)
    this.items = await this.$axios.$get("/fig_items");

    //await this.getBom()

     await this.checkBOM()

     await this.getActualItems()
      
     await this.checks()
      //console.log("created this.orderedBOM =", this.orderedBOM);

    //debugger 

    
    
    
  }
};
</script>

<style >
input[type="text"] {
  width: 400px;
}

#list {
  width: 400px;
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

.unfound {
  background-color: crimson;
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
  width: 80%;
  z-index: 2; /* Could be more or less, depending on screen size */
}

.close {
  color: black;
  float: right;
  margin-left: 95%;
  font-size: 28px;
  font-weight: bold;
}

#additem {
  width: 100px;
  margin-left: 40%;
}

</style>