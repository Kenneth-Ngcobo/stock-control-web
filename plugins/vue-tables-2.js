import Vue from "vue";
import { ClientTable } from "vue-tables-2";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUserSecret)

Vue.component('font-awesome-icon', FontAwesomeIcon)


Vue.use(ClientTable, {}, false);

Vue.config.productionTip = false

//Vue.use(ClientTable);

//Vue.use(ClientTable, defaultTableOpt, false, 'bootstrap4');