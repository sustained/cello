import Vue from "vue";
import App from "./App.vue";

import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

Vue.directive("focus", {
  inserted: function(el) {
    el.focus();
  }
});

import CInput from "@/components/global/CelloInput.vue";

Vue.component("CInput", CInput);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
