import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './plugins/router';
import auth from './plugins/auth';
import axios from './plugins/axios';

Vue.use(Vuex);
Vue.use(auth);
Vue.use(axios);

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
