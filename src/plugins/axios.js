import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.DEV ? 'http://localhost:8003' : 'https://api.mtheb.tv',
});

export default {
  install(app) {
    app.config.globalProperties.axios = instance;
  },
};
