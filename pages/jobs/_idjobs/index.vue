<template :key="componentKey">
<div id="page" >
<!-------------------------------------  COMMENTS TABLE WHEN THE JOB HAS BEEN CANCELLED  ---------------------------------->
  <div class="col-md-5 float-left">
    <div v-if="job.status == 'cancelled'">
    <h5 style="color: red">This job has been cancelled</h5>
    <h5>Comments</h5>
    
    <!--p 
    v-for="comment in server_comments" :key="comment.idcomments"
    >{{comment.comment}}</p-->
    <table class="table table-bordered">
      <thead>
        <tr>
          <th style="width: 350px">Comment</th>
          <th>By</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="comment in server_comments" :key="comment.idcomments">
          <td>{{comment.comment}}</td>
          <td>{{comment.person}}</td>
          <td>{{comment.date}}</td> 
        </tr>
      </tbody>
    </table>
    </div>
<!-------------------------------------  JOB DETAILS  ---------------------------------------------------------------------->
    <table class="table">
      <tbody>
        <tr>
          
          <td><b>Job No</b></td>
          <td><b>: {{job.job_number}}</b></td>
          <td class="empty-col"></td>
          <td><b-button type="submit" variant="outline-primary" style="padding-top: 1%; width:110px;" v-on:click="cancelJob" v-if="job.status != 'cancelled'" >Cancel Job</b-button></td>
          <td><b-button type="submit" variant="outline-primary" style="padding-top: 1%" v-on:click="view_comments = true" >View Comments</b-button></td>
          <!--div v-if="job.po_number != null"-->
          <!--td v-if="job.po_number != null"><b>PO No</b></td>
          <td v-if="job.po_number != null"><b>: {{job.po_number}}</b></td-->
         
          
        </tr>
        <tr>
          
          <td><b>Customer</b></td>
          <td><b>: {{job.customer}}</b></td>
          <td class="empty-col"></td>
          <td><b-button type="submit" variant="outline-primary" style="padding-top: 1%; width:110px;" v-on:click="closeJob" v-if="job.status != 'cancelled'" >Close Job</b-button></td>
          <!--span v-if="job.invoice_number != null"-->
          <!--td v-if="job.invoice_number != null"><b>Invoice No</b></td>
          <td v-if="job.invoice_number != null"><b>: {{job.invoice_number}}</b></td-->
         
          
        </tr>
        <tr>
          <td><b>Due Date</b></td>
          <td><b>: {{job.req_del}}</b></td>
          <td class="empty-col"></td>
          <td><b-button type="submit" variant="outline-primary" style="padding-top: 1%" v-on:click="close_job = true; add_comment = true">Add comment</b-button></td>
          <!--span v-if="job.invoice_number_r != null"-->
          <!--td v-if="job.invoice_number_r != null"><b>Invoice2 No</b></td>
          <td v-if="job.invoice_number_r != null"><b>: {{job.invoice_number_r}}</b></td-->
         
        </tr>
      </tbody>
    </table>

<!-------------------------------------  ENTER COMMENTS MODAL -------------------------------------------------------------->

    <div v-if="close_job" id="myModal" class="modal" >

     <div class="modal_backdrop" @click="close_job = false"/>

    <form  class="modal-content">
    <div style="display: inline"> <!--class="form-group"-->
    <h6>Enter comments about the job</h6>
    <button v-on:click.prevent="close_job = false" class="close" >&times;</button>
    </div>
     <div v-if="add_comment">
    <textarea name="" id="" cols="50" rows="8" v-model="comments"></textarea>
    <div>
    <b-button style="padding-bottom: 4%" v-on:click="submitComments">Submit</b-button>
    </div>
     </div>
    </form>
    </div>

<!----------------------------------- -  VIEW COMMENTS MODAL ------------------------------------------------------------>  

   <div v-if="view_comments" id="myModal" class="modal" >

     <div class="modal_backdrop" @click="closeComments()"/>

    <div  class="modal-content">
    <div style="display: inline"> <!--class="form-group"-->
    <b-button style="height: 40px;" v-on:click="add_comment = true">Add</b-button>
    <button v-on:click.prevent="closeComments()" class="close" >&times;</button>
    </div>
    <h6>{{job_number}}</h6>
    <table class="table table-bordered table-hover" v-if="server_comments.length>0">
      <thead>
        <tr>
          <th>Comment</th>
          <th>Person</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="com in server_comments" :key="com.idcomments">
          <td>{{com.comment}}</td>
          <td>{{com.person}}</td>
          <td>{{com.date}}</td>
        </tr>
      </tbody>
    </table>
    <div v-else>No comments to show</div>
    <div v-if="add_comment">
    <textarea name="" id="" cols="50" rows="5" v-model="comments"></textarea>
    <br>
    <b-button style="padding-bottom: 4%" v-on:click="submitComments">Submit</b-button>
    </div>
    </div>
    </div>
<!-------------------------------------  ITEMS ON ORDER  ------------------------------------------------------------------->
    <h5>Items on job:</h5>
    <table class="table table-bordered table-hover" >
      <thead>
        <tr>
          <th style="width: 45px;">Select</th>
          <th>#</th>
          <th style="width: 200px;">Item</th>
          <th>Qty</th>
          <th>Status</th>
        
        </tr>
      </thead>
        <tbody>
          <tr v-for="(item,index) in ordered_boms"
          v-bind:key="item.idordered_boms"
          @contextmenu.prevent="$refs.menu.open">
          <td style="text-align: center; vertical-align: middle;"><input type="radio"  :value="item.idordered_boms" v-on:change="radioValue" v-model="pcba_id"></td> <!---------------{{ displayIndex(item)+1 }}-->
          <td style="text-align: center; vertical-align: middle;">{{index+1}}</td>

          <td><nuxt-link :to="`/jobs/${job.job_number}/${item.idordered_boms}`">{{ item.bom_name }}</nuxt-link></td> <!--nuxt-link :to="`/jobs/${order.idorders}/${ordered_items.idordered_items}`"> </nuxt-link-->
          <td><input type="text" :placeholder="item.qty" :readonly="pcba_id!=item.idordered_boms" v-model="edit_bom_qty[index]"></td> <!---{{item.qty}}-->
          <!--td v-text="getBomStage(item.idordered_boms)"></td-->
          <td>
          <b-progress :max="13" height="1.5rem"  class="progress position-relative">
            <b-progress-bar :value="progressValue(item.idordered_boms)"> 
              <span style="color: black; font-size: 15px;" class="justify-content-center d-flex position-absolute w-auto" v-text="getBomStage(item.idordered_boms)"></span> <!-- Displays the job status -->
            </b-progress-bar>
          </b-progress>
          </td>
          </tr>
          <tr v-if="add_new">
            <td>{{''}}</td>
            <td>{{''}}</td>
            <td><input list="bom" style="width:100%;" v-model="new_bom_name"></td>
            <datalist id="bom">
            <option v-for="bom in boms" :key="bom.idbom">{{bom.bom_name}}</option>
            </datalist>
            <td><input type="text" v-model="new_bom_qty"></td>
            <td><button v-on:click="addNewBom">Add</button></td>
          </tr>
        </tbody>
    </table>

    <span v-if="pcba_id > 0">
    <b-button variant="outline-primary" style="padding-bottom: 5%" v-on:click="editBom(pcba_id)">Edit</b-button>
    <b-button variant="outline-primary" style="padding-bottom: 5%" v-on:click="removeBom(pcba_id)">Remove</b-button>
    </span>
    <b-button type="submit" variant="outline-primary" style="padding-bottom: 5%" v-on:click="add_new = true" v-if="job.status != 'cancelled'">Add BOM</b-button>

<!--------------------------------- ---  CONTEXT MENU FOR ITEMS ON ORDER --------------------------------------------------->

     <vue-context ref="menu" class="context-menu">
          <li @click.prevent="editBom1($event.target.innerText)">Edit</li>
          <li @click.prevent="removeBom1($event.target.innerText)">Delete</li>
          <li @click.prevent="add_new = true">Add BOM</li>
          <!--li @click.prevent="onClick($event.target.innerText)">Do something else </li-->
      </vue-context>

<!-------------------------------------  INVOICES TABLE -------------------------------------------------------------------->
   <br>
   <br>
    <table class="table table-bordered" v-if="job.status != 'cancelled'">
      <thead>
        <tr>
          <th>Date</th>
          <th>Invoice Number</th>
          <th v-for="(item,index) in ordered_boms" :key="index">{{index+1}}</th> <!--th v-for="(item,index) in ordered_boms">{{index+1}}</th-->
          <th></th>
          
        </tr>
      </thead>
      <tbody> <!--------------------------- LOAD EXISTING INVOICES ------------------------->
        <tr v-for="(invoice,index) in arr" :key="index">
          <td><input :type="inputType3[index]" v-if="checkInput3(invoice, index)" v-model="invoice_date[index]" 
           id="date-input" autocomplete="off" :placeholder="getInvoice1(invoice).date" 
          @focus="focus3[index] = true; checkedInvoice = invoice" @blur="focus3[index] = false"> </td>
          <!--td v-if="getInvoice1(invoice).date != null"><input type="text" id="date-input" v-model="invoice_date[index]" :placeholder="getInvoice1(invoice).date" autocomplete="off" @focus="checkedInvoice = invoice"></td>
          <td v-if="getInvoice1(invoice).date == null"><input type="date" id="date-input" v-model="invoice_date[index]" @focus="checkedInvoice = invoice"></td-->
          <td><input type="text" id="date-input" v-model="invoice_number[index]" :placeholder="invoice" @focus="checkedInvoice = invoice" autocomplete="off"></td> <!--:placeholder="invoice"-->
          <td v-for="(item, index2) in ordered_boms" :key="item.idordered_boms"><input type="text" :placeholder="getInvoice(invoice, item.bom_name).qty" v-model="invoice_qty[index][index2]" @focus="checkedInvoice = invoice"></td> <!--v-model="invoice.invoice_qty[index]"--> <!--:placeholder="getInvoice(invoice, item.bom_name).qty"-->
          <td><b-button style="padding-top: 0%;" v-on:click="modifyInvoice(invoice)" :disabled="checkedInvoice!=invoice">Modify</b-button></td>
          
        </tr>
        <!---------------- NEW INVOICE ROW THAT APPEARS BELOW EXISTING INVOICES------------------------------------>
        <tr>
          <td><input type="date" id="date-input" v-model="invoice.invoice_date"></td>
          <td><input type="text" id="date-input" autocomplete="off" v-model="invoice.invoice_number"></td>
          <td v-for="(item,index) in ordered_boms" :key="item.idordered_boms"><input type="text" v-model="new_invoice_qty[index]"></td> <!--v-model="invoice.invoice_qty[index]"-->
          <td><b-button style="padding-top: 0%; width: 65px;" v-on:click="postInvoice">Add</b-button></td>
        </tr>
      </tbody>
    </table>
  

  </div> <!------ END OF LEFT SECTION ------->
    
<!-------------------------------------  JOB STAGE DISPLAY SECTION --------------------------------------------------------->
  <div class="col-md-7 float-right"> <!---------- START OF RIGHT SECTION ------>
    <!--h6 id="select-bom" v-if="pcba_id == 0"><b>Select BOM to display or modify stages</b></h6-->
  
    <form class="form-horizontal, form-main"
      v-for="(stage,index) in stages"
      :key="stage.id"> 
      <div class="form-group">
          <!--input type="radio" :value="stage.id" v-model="checkedID"-->

        <!-------------- PART THAT DISPLAYS STAGE QTY FROM SMT COMPLETED ONWARDS -------------------->
          <label class="control-label col-sm-4">{{stage.stage}}</label>
          <input v-if="index>7" type="text" v-model="stage_qty[index]" :readonly="checkedID!=stage.id" 
           :placeholder="getStage(stage.stage).stage_qty || 'Qty'" @focus="checkedID = stage.id" :disabled="pcba_id == 0"
         >
          <span v-else><tr><td class="empty-col2"></td></tr></span> <!---    ---->

        <!--------------- STAGE DATE INPUT ------------------------------------------------------------------------------>
          <input :type="inputType[index]" v-if="checkInput(stage.stage, index)" v-model="date_modified[index]" 
          :readonly="checkedID!=stage.id" id="date-input" autocomplete="off" :placeholder="getStage(stage.stage).date_modified" 
          @focus="focus[index] = true; checkedID = stage.id" @blur="focus[index] = false" :disabled="pcba_id == 0"> 

        <!--------------- SELECT JOB STATUS OR DISPLAY IT AS TEXT ----------------------------------------------------------------------------------------------->
          <select v-if="getStage(stage.stage).job_status == null || (focus_status[index] == true)" v-model="job_status[index]" 
          @focus="checkedID = stage.id" :disabled="pcba_id == 0"> <!--v-model="job_status[index]"--->
              <option value="" disabled selected hidden></option>
              <option value="okay">Okay</option>
              <option value="repair">Repair</option>
              <option value="scrap">Scrap</option>
          </select>
          <input type="text" id="status" v-else v-model="job_status[index]" 
          :readonly="checkedID!=stage.id" :placeholder="getStage(stage.stage).job_status" 
          @focus="focus_status[index] = true; checkedID = stage.id" @blur="focus_status[index] = false" :disabled="pcba_id == 0">
          <!-----v-if="getStage(stage.stage).job_status != null && (focus_status[index] == false || focus_status[index] == undefined)"------>

        <!-----------------  PERSON INPUT OR DISPLAY -------------------------------------------------------------------------------------------------->
          <input type="text" id="person" v-model="person[index]" readonly :placeholder="getStage(stage.stage).person" 
          @focus="checkedID = stage.id" disabled > <!--="pcba_id == 0"--->

        <!------------------- BUTTON TO ENTER OR MODIFY STAGE -------------------------------------------------------------------------------------------------------------------->
          <b-button variant="secondary" style="padding-top: 0.2%;" v-on:click="addStage(stage.stage, index); getBomStage(pcba_id)" :disabled="checkedID!=stage.id" >Modify</b-button>

        <!------------------  ENTER PO NUMBER ONCE PO RECIEVED STAGE HAS BEEN REACHED---------------------------------------------------------------------------------------------------------->
          <span v-if="check_qty">
            <span v-if="index == 4">
            <span v-if="(typeof getStage('PO received').stage_qty != 'undefined') && job.po_number == null">
              <tr><td class="empty-col4"></td></tr>
            <input id="po-number" type="text" v-model="po_number" placeholder="Enter PO No">
            <button v-on:click.prevent="addPO">Add</button>
            </span>
            </span>
          <!--------------------ENTER INVOICE IN JOB STAGES TABLE -------------------------->
            <!--span v-if="index == 11">
            <span v-if="(typeof getStage('Invoice generated').stage_qty != 'undefined') && job.invoice_number == null">
              <tr><td class="empty-col3"></td></tr>
            
            <input id="po-number" type="text" v-model="invoice_number" placeholder="Enter Invoice No">
            <button v-on:click.prevent="addInvoice">Add</button>
            </span>
            </span-->
          </span>
        <!------------------------------------------------------------------------------->
      </div>
    </form>
<!-------------------------------------  ITEMS REMAINING FROM THE JOB ------------------------------------------------------>
        <span v-if="check_qty"> <!-- This was to make sure there is a bom selected otherwise getStage would return an error----->
            
            <span v-if="(typeof getStage('SMT completed').stage_qty !='undefined') && (getStage('SMT completed').stage_qty < getBOM(pcba_id).qty)">
              <h6 id="items-remaining"><b>Items remaining from  the job</b></h6>
              <form class="form-horizontal">
                <!--input type="radio" :value="1" v-model="checkedIDR"-->
                <label class="control-label col-sm-4">SMT Completed</label>
                <input type="text" v-model="smtjob_stage.stage_qty" :readonly="checkedIDR!=1" :placeholder="getStage('SMT completed - R').stage_qty || 'Qty'" @focus="checkedIDR = 1">
                <input :type="inputType2[0]" v-if="checkInput2('SMT completed - R',  0)" :readonly="checkedIDR!=1" id="date-input"  v-model="smtjob_stage.date_modified" 
                @focus="focus2[0] = true; checkedIDR = 1" @blur="focus2[0] = false" :placeholder="getStage('SMT completed - R').date_modified">
                <!--input type="text" v-if="getStage('SMT completed - R').date_modified != null" :readonly="checkedIDR!=1" autocomplete="off" :placeholder="getStage('SMT completed - R').date_modified" id="date-input" v-model="smtjob_stage.date_modified" @focus="checkedIDR = 1"-->
                <select v-if="getStage('SMT completed - R').job_status == null" v-model="smtjob_stage.job_status" @focus="checkedIDR = 1">
                    <option value="" disabled selected hidden>Select status</option>
                    <option value="okay">Okay</option>
                    <option value="repair">Repair</option>
                    <option value="scrap">Scrap</option>
                </select>
                <input type="text" id="status" v-else :readonly="checkedIDR!=1" :placeholder="getStage('SMT completed - R').job_status" v-model="smtjob_stage.job_status" @focus="checkedIDR = 1">
                <input type="text" id="person" v-model="smtjob_stage.person" readonly disabled :placeholder="getStage('SMT completed - R').person || 'Initials'" @focus="checkedIDR = 1">
                <b-button style="padding-top: 0%;" v-on:click.prevent="remainingSMT(smtjob_stage, getStage('SMT completed - R').idstages)" :disabled="checkedIDR!=1">Modify</b-button>
              </form> 
            </span>

            <span v-if="(typeof getStage('Conventional completed').stage_qty !='undefined') && (getStage('Conventional completed').stage_qty < getBOM(pcba_id).qty)">
              
              <form class="form-horizontal">
                <!--input type="radio" :value="2" v-model="checkedIDR"-->
                <label class="control-label col-sm-4">Conventional Completed</label>
                <input type="text" v-model="cnvjob_stage.stage_qty" :readonly="checkedIDR!=2" :placeholder="getStage('Conventional completed - R').stage_qty || 'Qty'"  @focus="checkedIDR = 2">
                <input :type="inputType2[1]" v-if="checkInput2('Conventional completed - R',  1)" :readonly="checkedIDR!=2" id="date-input"  v-model="cnvjob_stage.date_modified" 
                @focus="focus2[1] = true; checkedIDR = 2" @blur="focus2[1] = false" :placeholder="getStage('Conventional completed - R').date_modified">
                <!--input type="date" v-if="getStage('Conventional completed - R').date_modified == null" id="date-input" v-model="cnvjob_stage.date_modified"  @focus="checkedIDR = 2"-->
                <!--input type="text" v-else :readonly="checkedIDR!=2" autocomplete="off" :placeholder="getStage('Conventional completed - R').date_modified" id="date-input" v-model="cnvjob_stage.date_modified"  @focus="checkedIDR = 2"-->
                <select v-if="getStage('Conventional completed - R').job_status == null" v-model="cnvjob_stage.job_status"  @focus="checkedIDR = 2">
                    <option value="" disabled selected hidden>Select status</option>
                    <option value="okay">Okay</option>
                    <option value="repair">Repair</option>
                    <option value="scrap">Scrap</option>
                </select>
                <input type="text" id="status" v-else :readonly="checkedIDR!=2" :placeholder="getStage('Conventional completed - R').job_status" v-model="cnvjob_stage.job_status" @focus="checkedIDR = 2">
                <input type="text" id="person" v-model="cnvjob_stage.person" readonly disabled :placeholder="getStage('Conventional completed - R').person || 'Initials'"  @focus="checkedIDR = 2">
                <b-button style="padding-top: 0%;" v-on:click.prevent="remainingSMT(cnvjob_stage, getStage('Conventional completed - R').idstages)" :disabled="checkedIDR!=2">Modify</b-button>
              </form> 
            </span>

            <span v-if="(typeof getStage('Testing').stage_qty !='undefined') && (getStage('Testing').stage_qty < getBOM(pcba_id).qty)">
              
              <form class="form-horizontal">
                <!--input type="radio" :value="3" v-model="checkedIDR"-->
                <label class="control-label col-sm-4">Testing</label>
                <input type="text" v-model="tstjob_stage.stage_qty" :readonly="checkedIDR!=3" :placeholder="getStage('Testing - R').stage_qty || 'Qty'"  @focus="checkedIDR = 3">
                <input :type="inputType2[2]" v-if="checkInput2('Testing - R',  2)" :readonly="checkedIDR!=3" id="date-input"  v-model="cnvjob_stage.date_modified" 
                @focus="focus2[2] = true; checkedIDR = 3" @blur="focus2[2] = false" :placeholder="getStage('Testing - R').date_modified">
                <!--input type="date" v-if="getStage('Testing - R').date_modified == null" id="date-input" v-model="tstjob_stage.date_modified" @focus="checkedIDR = 3"-->
                <!--input type="text" v-else :readonly="checkedIDR!=3" autocomplete="off" :placeholder="getStage('Testing - R').date_modified" id="date-input" v-model="tstjob_stage.date_modified" @focus="checkedIDR = 3"-->
                <select v-if="getStage('Testing - R').job_status == null" v-model="tstjob_stage.job_status" @focus="checkedIDR = 3">
                    <option value="" disabled selected hidden>Select status</option>
                    <option value="okay">Okay</option>
                    <option value="repair">Repair</option>
                    <option value="scrap">Scrap</option>
                </select>
                <input type="text" id="status" v-else :readonly="checkedIDR!=3" :placeholder="getStage('Testing - R').job_status" v-model="tstjob_stage.job_status" @focus="checkedIDR = 3">
                <input type="text" id="person" v-model="tstjob_stage.person" readonly disabled :placeholder="getStage('Testing - R').person || 'Initials'" @focus="checkedIDR = 3">
                <b-button style="padding-top: 0%;" v-on:click.prevent="remainingSMT(tstjob_stage, getStage('Testing - R').idstages)" :disabled="checkedIDR!=3">Modify</b-button>
              </form> 
            </span>

            <span v-if="(typeof getStage('Invoice generated').stage_qty !='undefined') && (getStage('Invoice generated').stage_qty < getBOM(pcba_id).qty)">
              
              <form class="form-horizontal">
                <!--input type="radio" :value="4" v-model="checkedIDR"-->
                <label class="control-label col-sm-4">Invoice generated</label>
                <input type="text" v-model="invjob_stage.stage_qty" :readonly="checkedIDR!=4" :placeholder="getStage('Invoice generated - R').stage_qty || 'Qty'" @focus="checkedIDR = 4">
                <input :type="inputType2[3]" v-if="checkInput2('Invoice generated - R',  3)" :readonly="checkedIDR!=4" id="date-input"  v-model="cnvjob_stage.date_modified" 
                @focus="focus2[3] = true; checkedIDR = 4" @blur="focus2[3] = false" :placeholder="getStage('Invoice generated - R').date_modified">
                <!--input type="date" v-if="getStage('Invoice generated - R').date_modified == null" id="date-input" v-model="invjob_stage.date_modified" @focus="checkedIDR = 4"-->
                <!--input type="text" v-else :readonly="checkedIDR!=4" autocomplete="off" :placeholder="getStage('Invoice generated - R').date_modified" id="date-input" v-model="invjob_stage.date_modified" @focus="checkedIDR = 4"-->
                <select v-if="getStage('Invoice generated - R').job_status == null" v-model="invjob_stage.job_status" @focus="checkedIDR = 4">
                    <option value="" disabled selected hidden>Select status</option>
                    <option value="okay">Okay</option>
                    <option value="repair">Repair</option>
                    <option value="scrap">Scrap</option>
                </select>
                <input type="text" id="status" v-else :readonly="checkedIDR!=4" :placeholder="getStage('Invoice generated - R').job_status" v-model="invjob_stage.job_status" @focus="checkedIDR = 4">
                <input type="text" id="person" v-model="invjob_stage.person" readonly disabled :placeholder="getStage('Invoice generated - R').person || 'Initials'" @focus="checkedIDR = 4">
                <b-button style="padding-top: 0%;" v-on:click.prevent="remainingSMT(invjob_stage, getStage('Invoice generated - R').idstages)" :disabled="checkedIDR!=4">Modify</b-button>
              </form> 
              <!--span v-if="(typeof getStage('Invoice generated - R').stage_qty != 'undefined') && job.invoice_number_r == null">
              <tr><td class="empty-col2"></td></tr>
              <input placeholder="Enter Invoice NO." id="po-number" type="text" v-model="invoice_number_r">
              <button v-on:click="addInvoiceR">Add</button>
              </span-->
            </span>

            <span v-if="(typeof getStage('Despatched').stage_qty !='undefined') && (getStage('Despatched').stage_qty < getBOM(pcba_id).qty)">
              
              <form class="form-horizontal">
                <!--input type="radio" :value="5" v-model="checkedIDR"-->
                <label class="control-label col-sm-4">Despatched</label>
               
                <input type="text" v-model="desjob_stage.stage_qty" :readonly="checkedIDR!=5" :placeholder="getStage('Despatched - R').stage_qty || 'Qty'" @focus="checkedIDR = 5">
                <input :type="inputType2[4]" v-if="checkInput2('Despatched - R',  4)" :readonly="checkedIDR!=5" id="date-input"  v-model="cnvjob_stage.date_modified" 
                @focus="focus2[4] = true; checkedIDR = 5" @blur="focus2[4] = false" :placeholder="getStage('Despatched - R').date_modified">
                <!--input type="date" v-if="getStage('Despatched - R').date_modified == null" id="date-input" v-model="desjob_stage.date_modified" @focus="checkedIDR = 5"-->
                <!--input type="text" v-else :readonly="checkedIDR!=5" autocomplete="off" :placeholder="getStage('Despatched - R').date_modified" id="date-input" v-model="desjob_stage.date_modified" @focus="checkedIDR = 5"-->
                <select v-if="getStage('Despatched - R').job_status == null" v-model="desjob_stage.job_status" @focus="checkedIDR = 5">
                    <option value="" disabled selected hidden>Select status</option>
                    <option value="okay">Okay</option>
                    <option value="repair">Repair</option>
                    <option value="scrap">Scrap</option>
                </select>
                <input type="text" id="status" v-else :readonly="checkedIDR!=5" :placeholder="getStage('Despatched - R').job_status" v-model="desjob_stage.job_status" @focus="checkedIDR = 5">
                <input type="text" id="person" v-model="desjob_stage.person" readonly disabled :placeholder="getStage('Despatched - R').person || 'Initials'" @focus="checkedIDR = 5">
                <b-button style="padding-top: 0%;" v-on:click.prevent="remainingSMT(desjob_stage, getStage('Despatched - R').idstages)" :disabled="checkedIDR!=5">Modify</b-button>
              </form> 
            </span>
        </span>   
<!-------------------------------------------------------------------------------------------------------------------------->

</div>  <!---------- END OF RIGHT SECTION ------>
</div>
</template>

<script>
//import stageDisplay from "@/components/job/addBom";
import VueContext from 'vue-context';

export default {

 // props: ['ordered_boms'],

  components:{ VueContext }, //You are giving me reloading/refreshing problems
  

  data() {
    return {
      id: this.$route.params.job_number, //this.$route.params.idjobs,
      ordered_boms: [],
      boms: [],
      pcba_id: 0,
      selectedStatus: "",
      idstage: 0,
      stage_qty: [],
      date_modified: [],
      person: [],
      job_status: [],
      job_status2: '',
      bom_statuses: [],
      server_comments: [],
      view_comments: false,
      add_comment: false,
      job_stage: {  //V-MODELLED FROM THE INPUT
          stage: "",
          status: "",
          stage_qty: "",
          stage_date: "",
          user: ""
      },
/********************************* REMAINING ITEMS V-MODELS ************************************************************/
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
/****************************************************************************************/
      job_stages: [], //LOADED FROM THE DATABASE
      lastIndex: "",
      job: {},
      stages: [{id:1, stage: 'Data pack received'},{id:2, stage:'Supplier quote sent'},{id:3, stage:'Supplier quote received'},{id:4, stage:'Customer quote sent'},{id:5, stage:'PO received'},{id:6, stage:'Components ordered'},{id:7, stage:'Components received'},{id:8, stage:'Kit completed'},{id:9, stage:'SMT completed'},{id:10, stage:'Conventional completed'},{id:11, stage:'Testing'},{id:12, stage:'Invoice generated'},{id:13, stage:'Despatched'}],
      checkedID: '',
      checkedIDR: '',
      checkedInvoice: '',
      send_date: '',
      send_qty: '',
      send_status: '',
      send_person: '',
      check_qty: false,
      po_number: '',
      invoice_number: [],
      invoice_date: [],
      invoice_number_r: '',
      all_stages: [],
      add : false,
      invoice: {
        invoice_number: null,
        invoice_date: null,
        },
      invoice_qty: [],
      new_invoice_qty: [],
      invoices: [],
      similar_invoices: [],
      arr: [],
      new: false,
      send_invoice_qty: [],
      send_invoice_number: '',
      idinvoices: [],
      final_qty: [],
      edit_bom_qty: [],
      new_bom_qty: '',
      new_bom_name: '',
      add_new: false,
      inputType: [],
      inputType2: [],
      inputType3: [],
      focus: [],
      focus2: [],
      focus3: [],
      focus_status: [],
      close_job: false,
      date_changed: null,
      qty_changed: null,
      status_changed: null,
      comments: '',
      componentKey: 0,
      
    };
  },

  methods: {

    progressValue(idordered_boms) {
        let value = this.all_stages.filter(r => r.itemNO == idordered_boms)
        return value.length
    },

    closeComments() {
        //this.opened_job = ''
        this.view_comments = false
        this.add_comment = false
      },

    addStage: async function(stage, index) {
      
        let check_stage = await this.getStage(stage)
       
        if(typeof check_stage.job_stage != 'undefined'){ //Checking if stage exists
          this.id = check_stage.idstages //Give the ID of the existing stage
          if(this.date_modified.length == 0) { //If the date input has not been entered, send previous stage date
            this.send_date = check_stage.date_modified.split('T')[0]
          }
          else {
            this.send_date = this.date_modified[index]
            this.date_changed = this.date_modified[index]} //Else send the newly entered date

          if(this.stage_qty.length == 0) { //If stage quantity is empty, send previous stage qty
            this.send_qty = check_stage.stage_qty
            this.qty_changed = null
          }
          else {this.send_qty = this.stage_qty[index] //Else send newly entered qty
                this.qty_changed = this.stage_qty[index]} //this goes to change log table

          if (this.person.length == 0) { //If initials not entered, keep the previous stage initials
            this.send_person = check_stage.person
          }
          else {this.send_person = this.person[index]} // Else send newly entered initials

          if (this.job_status.length == 0) { //If job status not entered, keep previous stats
            this.send_status = check_stage.job_status
            this.status_changed = null
          }
          else {this.send_status = this.job_status[index]
                this.status_changed = this.job_status[index]} //Else send new status

        await this.$axios
        .$post("/job_stages", {
                  id: this.id,
                  //job_stage: this.job_stages.stage,
                  job_stage: this.stages[index].stage,
                  stage_qty: this.send_qty,
                  date_modified: this.dateNow(),//this.send_date,
                  job_status: this.send_status,
                  person: this.$auth.user.username,//this.send_person,
                  jobID: this.job.job_number,
                  itemNO: this.pcba_id
        })
      /********** CHANGE LOG CHUNK   *********/
        //let yr = new Date().getFullYear()
        //let mth = ('0' + (new Date().getMonth()+1)).slice(-2) 
        //let dt = new Date().getDate()
        await this.logChange(this.job.job_number, this.getBOM(this.pcba_id).bom_name, null, this.stages[index].stage, this.qty_changed, this.status_changed, check_stage.stage_qty, check_stage.date_modified)
        //previous stage date this.date_modified[index]
        //previous qty check_stage.stage_qty
        
      /************************************** */   
        }
        else { //completely new stage
          this.id = 0; 

          await this.$axios
          .$post("/job_stages", {
                  id: this.id,
                  //job_stage: this.job_stages.stage,
                  job_stage: this.stages[index].stage,
                  stage_qty: this.stage_qty[index],
                  date_modified: this.date_modified[index],
                  job_status: this.job_status[index],
                  person: this.$auth.user.username,//this.person[index],
                  jobID: this.job.job_number,
                  itemNO: this.pcba_id
        })
        }

        
        //this.$forceUpdate();
        //this.$refs.page.$forceUpdate()
        await this.getBomStage(this.pcba_id)
        await this.progressValue(this.pcba_id)
        await this.radioValue()
        window.location.reload(); //forces the window to reload
        //this.componentKey += 1;
       
       
    },

    dateNow(){
      let yr = new Date().getFullYear()
      let mth = ('0' + (new Date().getMonth()+1)).slice(-2) 
      let dt = ('0' + new Date().getDate()).slice(-2)
      return yr.toString()+'-'+mth.toString()+'-'+dt.toString()

    },

    radioValue: async function() {
      //GETS JOB STAGES FOR A SPECIFIC JOB AND BOM FROM THE SERVER
     
      this.job_stages = await this.$axios.$get(`job_stages/${this.job.job_number}/${this.pcba_id}`)
      //console.log(this.job_stages)
      this.check_qty = true
    
    },

    getStage(stage) {
        //return this.job_stages[index] || {}
        return this.job_stages.find(st => st.job_stage == stage) || {}
    },

     getInvoice(invoice_number, bom_name) {
        //return this.job_stages[index] || {}
        return this.invoices.find(inv => inv.bom_name == bom_name && inv.invoice_number == invoice_number) || {}
    },

    getInvoice1(invoice_number) {
        //return this.job_stages[index] || {}
        return this.invoices.find(inv => inv.invoice_number == invoice_number) || {}
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
        if(bom_stage.length>= 5 && bom_stage.length <8) {
        return "Ordering"
        }
        if(bom_stage.length == 8) {
        return "Kitting"
        }
        if(bom_stage.length > 8 && bom_stage.length < 11) {
        return "Production"
        }
        if(bom_stage.length == 11) {
        return "Testing"
        }
        if(bom_stage.length == 12) {
        return "Invoicing"
        }
        if(bom_stage.length > 12) {
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
      this.job = job.find(v => v.job_number == this.$route.params.idjobs); //this.$route.params.idjobs);
    },

    async postInvoice() {
      for(let i = 0; i<this.ordered_boms.length; i++) {
      
          await this.$axios.$post("/invoices", {
            invoice_number: this.invoice.invoice_number,
            job_number: this.job.job_number,
            bom_name: this.ordered_boms[i].bom_name,
            qty: this.new_invoice_qty[i],
            date: this.invoice.invoice_date})

      }
      await this.getInvoices()
      
      for(let i = 0; i<this.invoices.length; i++) { //6 invoices in this case
        this.myFilter(this.invoices[i]) //Filters out repeated invoice numbers and returns one instance in the arr array, Pass the invoice object
      }
      
      for (let i = 0; i < this.arr.length; i++) { //number of non-repeated invoices
      let row = []; 
      for (let j = 0; j < this.ordered_boms.length; j++) {
        row.push(null); //Number of rows correspond to boms on order
      }
      this.invoice_qty.push(row); //Invoice_qty is v-modelling the quanities to be entered
    }
      this.new_invoice_qty = []
      this.invoice.invoice_date = null
      this.invoice.invoice_number = null

    },


    async modifyInvoice(invoice) {

      let indexofbom = []
      let bom_modify = [] //any bom that has been given quantity
      let modify_qty = [] //actual quantity
      let invoiceObjects = []
      let idinvoices = [] //ids of existing invoices

      for(let i = 0; i < this.arr.length; i++) {
          for(let j = 0; j < this.ordered_boms.length; j++) {
            if(this.invoice_qty[i][j] != undefined && this.invoice_qty[i][j].length > 0) {
                indexofbom.push(this.invoice_qty[i].indexOf(this.invoice_qty[i][j])) //index of qty entered determines index of bom
                bom_modify.push(this.ordered_boms[this.invoice_qty[i].indexOf(this.invoice_qty[i][j])].bom_name) //get bom name with a qty change
                
                modify_qty.push(this.invoice_qty[i][j])  //get the actual qty to be modified
            } 
          }
      } 

      for(let i = 0; i<bom_modify.length; i++) {
        //find invoices that have this bom name and invoice number
          invoiceObjects.push(this.invoices.find(inv => inv.bom_name == bom_modify[i] && inv.invoice_number == invoice))    
      }
      

      for(let i = 0; i<invoiceObjects.length; i++) {
          if(typeof invoiceObjects[i] == 'undefined') {
            idinvoices[i] = 0
          }
          else {
            idinvoices[i] = invoiceObjects[i].idinvoices
          }
      }

      
      for(let i = 0; i<idinvoices.length; i++) {
          await this.$axios.$post("/invoices_modify", {
                idinvoices: idinvoices[i],
                invoice_number: invoice,
                job_number: this.job.job_number,
                bom_name: bom_modify[i],
                qty: modify_qty[i],
                date: this.dateNow() //previous date this.invoices.find(inv => inv.invoice_number == invoice).date
                })                   //previouis qty this.invoices.find(inv => inv.invoice_number == invoice).qty
      
      }

      for(let i = 0; i<idinvoices.length; i++) {

        await this.logChange(this.job.job_number, bom_modify[i], invoice, 'Invoice modified', modify_qty[i], null, 
        this.invoices.find(inv => inv.invoice_number == invoice && inv.bom_name == bom_modify[i]).qty, this.invoices.find(inv => inv.invoice_number == invoice).date)

      }
      
      await this.getInvoices() 
    
    },

    async getInvoices() {
      this.invoices = await this.$axios.$get(`/invoices/${this.job.job_number}`)
    },

    async similarInvoices() {
      for(let i = 0; i<this.invoices.length; i++) {
      
      }
    },
    //Filters if the invoice number is repeated, returns only one instance
    myFilter: function(val) { //invoice object is passed as val on created
      if(this.arr.indexOf(val.invoice_number) === -1) { //invoice number not there?
        this.arr.push(val.invoice_number); //push invoice numbers to arr array
        return val.invoice_number; //return the invoice number
      }
    },
    async addNewBom() {
       
         let response = await this.$axios
                .$post("/ordered_boms",{
                    //ORDERED ITEMS is an array of objects, find a way to insert each object as a row in sql
                    id: 0,
                    bom_name: this.new_bom_name,
                    qty: this.new_bom_qty,
                    job_number: this.job.job_number
                    //orders_id: this.order.id // LAST_ID() + 1??

            })
           this.add_new = false
           this.ordered_boms = await this.$axios.$get(`/ordered_boms/${this.job.job_number}`)
           let last_bom = this.ordered_boms[this.ordered_boms.length - 1]
           console.log('Last added bom = ', last_bom)

           /*for(let i = 0; i<this.ordered_boms.length; i++) {
      
              await this.$axios.$post("/invoices", {
                invoice_number: null,
                job_number: this.job.job_number,
                bom_name: this.ordered_boms[i].bom_name,
                qty: null,
                date: null})
            }*/

            //let yr = new Date().getFullYear()
            //let mth = ('0' + (new Date().getMonth()+1)).slice(-2) 
            //let dt = new Date().getDate()
            await this.logChange(this.job.job_number, last_bom.bom_name, null, 'BOM added to the job', last_bom.qty, null, null, null)

    },

    async removeBom(pcba_id) {
      
      let inv_arr = this.invoices.filter(inv => inv.bom_name == this.getBOM(pcba_id).bom_name)
      if(inv_arr.length > 0) { //check if BOM to be removed has invoices
        alert(`${this.getBOM(pcba_id).bom_name} has invoices and cannot be deleted`)
      }
      else { //Proceed to remove the BOM if it does not have invoices
      if(confirm(`Are you sure you want to delete ${this.getBOM(pcba_id).bom_name}?`)) {

        //let yr = new Date().getFullYear()
        //let mth = ('0' + (new Date().getMonth()+1)).slice(-2) 
        //let dt = new Date().getDate()
        await this.logChange(this.job.job_number, this.getBOM(pcba_id).bom_name, null, 'BOM removed from job', null, null, this.getBOM(pcba_id).qty, this.getBOM(pcba_id).date_modified)
       
        await this.$axios.$post('/ordered_boms_remove', {
              idordered_boms: pcba_id})
        this.ordered_boms = await this.$axios.$get(`/ordered_boms/${this.job.job_number}`)
        
        
        this.pcba_id = 0
      }
      }
    },

    async editBom(pcba_id) {
      let send_edit_qty = this.getBOM(pcba_id).qty
      for(let i = 0; i<this.edit_bom_qty.length; i++){ //edit_bom_qty is the array v-modelling bom qty changes
          if(typeof this.edit_bom_qty[i] != 'undefined') {
            send_edit_qty = this.edit_bom_qty[i] //only one bom qty change at a time - pick what has been entered
          }
      }
      await this.$axios.$post('/ordered_boms_edit', {
              idordered_boms: pcba_id, //BOM ID
              qty: send_edit_qty}) //QTY update
      
      

        
        await this.logChange(this.job.job_number, this.getBOM(this.pcba_id).bom_name, null, 'BOM qty change', send_edit_qty, this.status_changed, this.getBOM(pcba_id).qty, this.getBOM(pcba_id).date_modified)


        //Log on the change log
        this.ordered_boms = await this.$axios.$get(`/ordered_boms/${this.job.job_number}`)
        this.pcba_id = 0
    },

    editBom1() {
      
    },

    async logChange(job_number, bom_name, invoice_number, stage, qty_changed, status_changed, previous_qty, previous_change_date) {
        await this.$axios.$post('/change_log', {
          id: 0,
          job_number: job_number,
          bom_name: bom_name,
          invoice_number: invoice_number,
          stage: stage,
          person: this.$auth.user.username,
          //date: this.dateNow(),
          //date_changed: this.date_changed,
          qty_changed: qty_changed,
          status_changed: status_changed,
          previous_qty: previous_qty,
          previous_change_date: previous_change_date
        })
        this.qty_changed = null
        this.status_changed = null
    
    },
    
    async cancelJob() {
      
      if(this.invoices.length > 0) {
        alert(`This job has items that have been invoiced and cannot be cancelled`)
      }
      else {

      if(confirm("Are you sure you want to cancel this job?")) {
        //console.log('Cancel confirmed')
        await this.$axios.$post('/jobs_status', {
          job_number: this.job.job_number,
          status: 'cancelled'
        }) 
        this.close_job = true
        
      }
      }
    },

    async closeJob() {
      
      let close_flag = true
      for(let i = 0; i<this.ordered_boms.length; i++) {
      this.bom_statuses.push(this.getBomStage(this.ordered_boms[i].idordered_boms))
      }
      for(let i = 0; i<this.bom_statuses.length; i++) {
        if(this.bom_statuses[i] != 'Despatched') {
            close_flag = false
        }
      }
      if(close_flag) {
        await this.$axios.$post('/jobs_status', {
          job_number: this.job.job_number,
          status: 'closed'
        }) 
        this.close_job = true
      }
      else {
        alert("Job can't be closed, not all items have been despatched")
      }
    },

    checkInput(stage, index) {
      if(this.getStage(stage).date_modified != null && !this.focus[index]) {
          this.inputType[index] = 'text'
          return true
      }
      else {
        this.inputType[index] = 'date'
        return true
      }
    },

    checkInput2(stage, index) {
      if(this.getStage(stage).date_modified != null && !this.focus2[index]) {
          this.inputType2[index] = 'text'
          return true
      }
      else {
        this.inputType2[index] = 'date'
        return true
      }
    },

    checkInput3(invoice, index) {
      
      if(this.getInvoice1(invoice).date != null && !this.focus3[index]) { 
          this.inputType3[index] = 'text'
          return true
      }
      else {
        this.inputType3[index] = 'date'
        return true
      }
    },

    async getComments() {
      this.server_comments = await this.$axios.$get(`/comments/${this.job.job_number}`)
    },

    async submitComments() {
      //add comments to the job
      /*this.$axios.$post('/jobs_comments', {
        comments: this.comments + `\nBy: ${this.$auth.user.username}`,
        job_number: this.job.job_number })
      this.close_job = false*/
      //let newDate = new Date()
      //let mth = ('0' + (newDate.getMonth()+1)).slice(-2)
      //let dt = ('0' + (newDate.getDate())).slice(-2)
      
      await this.$axios.$post('/comments', {
        comment: this.comments,
        person: this.$auth.user.username,
        job_number: this.job.job_number,
        date: this.dateNow()})//newDate.getFullYear().toString()+'-'+mth.toString()+'-'+dt.toString()})
        
      //await this.findJob()
      //console.log(newDate.getFullYear().toString()+'-'+mth.toString()+'-'+dt.toString())
      await this.getComments()
      this.close_job = false
      this.add_comment = false
    }
    
    

}, //END OF METHODS


created: async function() {
       await this.findJob()

       this.all_stages = await this.$axios.$get(`job_stagesall/${this.job.job_number}`)
        //console.log(this.job)
      await this.getInvoices()
      
      for(let i = 0; i<this.invoices.length; i++) { //6 invoices in this case
        this.myFilter(this.invoices[i]) //Filters out repeated invoice numbers and returns one instance in the arr array, Pass the invoice object
      }
      
      for (let i = 0; i < this.arr.length; i++) { //number of non-repeated invoices
      let row = []; 
      for (let j = 0; j < this.ordered_boms.length; j++) {
        row.push(null); //Number of rows correspond to boms on order
      }
      this.invoice_qty.push(row); //Invoice_qty is v-modelling the quanities to be entered
    }
  
    this.boms = await this.$axios.$get("/bom_list")

    this.ordered_boms = await this.$axios.$get(`/ordered_boms/${this.job.job_number}`)

  //INITIALISE SELECTED BOM TO BE THE FIRST ONE ON PAGE LOAD
    if(this.ordered_boms.length>0){
      this.pcba_id = this.ordered_boms[0].idordered_boms
      await this.radioValue()
    }
    else{
      this.pcba_id = 0
    }

    await this.getComments()

    } //END OF CREATED
}  // END OF EXPORT DEFAULT

</script>

<style scoped>


#option-buttons {
  color: blue;
}

#option-buttons:hover {
  color: darkblue;
  text-decoration: underline;
}

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

#person {
  width: 100px;
}

input[type="radio"] {
  margin-left: 10px;
}

#po-number {
  width: 150px;
}

select {
    padding: 2.5px;
    width: 120px;
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
  width: 40px;
}

.empty-col2 {
  width: 60px;
}

.empty-col3 {
  width: 280px;
}

.empty-col4 {
  width: 345px;
}

#items-remaining {
  margin-left: 12px;
}

#select-bom {
 margin-left: 12px;
 margin-bottom: 30px; 
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
  width: 60%; /* Could be more or less, depending on screen size */
  z-index: 2;
}

.close {
  color: black;
  float: right;

  font-size: 28px;
  font-weight: bold;
}

.progress-bar {
  background: lightskyblue;
}

</style>