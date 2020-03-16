import Vue from 'vue'
import App from './App'
import router from './router'
import resource from 'vue-resource'
import i18n from 'static/js/i18n'
import ScatterJS from 'scatterjs-core'
import ScatterEOS from 'scatterjs-plugin-eosjs'
ScatterJS.plugins(new ScatterEOS())
import store from './store'
import bigNumber from 'bignumber.js'
import sctuser from "static/js/user";
import util from 'static/js/util'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'wc-messagebox/style.css'
import Viewer from "v-viewer";
import "viewerjs/dist/viewer.css";
import { Confirm, Toast } from 'wc-messagebox'
import 'static/css/index.css'
Vue.use(Confirm)
Vue.use(Toast)
Vue.use(Viewer)
Vue.use(resource)

// 混入方法
import {
  mapGetters,
  mapActions
} from 'vuex'
Vue.mixin({
  data() {
    return {
      BigNumber: bigNumber,
      tokenDecimals: 4, //代币精度
      contract: {
        EOS: "eosio.token",
        EMDS: "medisharesbp",
      },
      sctuser: sctuser,
      webUtil: util,
      contract_domain: "https://api-kylin.eosasia.one/",
      table_url: "https://api-kylin.eosasia.one/v1/chain/get_table_rows"
    }
  },
  computed: {
    ...mapGetters({
      domain: "getDomain",
      account: "account",
      isLoading: "isLoading"
    })
  },
  methods: {
    ...mapActions(["setAccount", "setLoading"]),
    getAccount() {
      return new Promise((resolve, reject) => {
        sctuser.getAccount().then(res => {
          $("#login").modal("hide");
          this.setAccount(res)
          resolve(res)
        }).catch(error => {
          this.setLoading(false);
          this.$toast(this.$t("connect_scatter"), {
            duration: 2000,
          });
          reject('error:' + JSON.stringify(error));
        });
      })
    },
    bigNumber(num) {
      return new bigNumber(num)
    }
  }
});

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  store,
  router,
  components: { App },
  template: '<App/>'
})