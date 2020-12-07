import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './plugins/router';
import auth from './plugins/auth';
import axios from './plugins/axios';

Vue.use(Vuex);
Vue.use(auth, router);
Vue.use(axios);

Vue.config.productionTip = false;

const store = new Vuex.Store({
  state: {
    userData: null,
    contactDialog: false,
  },
  mutations: {
    setUserData(state, data) {
      state.userData = data;
      localStorage.setItem('userData', JSON.stringify(data));
    },
    setContactDialog(state, visible) {
      state.contactDialog = visible;
    }
  }
});

new Vue({
  render: h => h(App),
  vuetify,
  router,
  store: store,
}).$mount('#app')
