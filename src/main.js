import { createApp } from 'vue';
import { createStore } from 'vuex';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './plugins/router';
import auth from './plugins/auth';
import axios from './plugins/axios';

const store = createStore({
  state: {
    userData: null,
  },
  mutations: {
    setUserData(state, data) {
      state.userData = data;
      localStorage.setItem('userData', JSON.stringify(data));
    },
  },
});

const app = createApp(App);
app.use(store);
app.use(router);
app.use(vuetify);
app.use(auth, { router });
app.use(axios);

app.mount('#app');
