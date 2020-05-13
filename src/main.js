// Copyright (c) 2020 Mitchell Adair
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './plugins/router';
import auth from './plugins/auth';
import axios from 'axios';
import VueAxios from 'vue-axios'

Vue.use(Vuex);
Vue.use(VueAxios, axios);
Vue.use(auth);

Vue.config.productionTip = false;

const store = new Vuex.Store({
  state: {
    userData: null,
  },
  mutations: {
    setUserData(state, data) {
      state.userData = data;
    }
  }
});

new Vue({
  render: h => h(App),
  vuetify,
  router,
  store: store,
}).$mount('#app')
