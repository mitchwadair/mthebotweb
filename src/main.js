import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './plugins/router';
import auth from './plugins/auth';
import axios from 'axios'
import VueAxios from 'vue-axios'
 
Vue.use(VueAxios, axios)
Vue.use(auth);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  vuetify,
  router,
}).$mount('#app')
