import axios from 'axios';

let instance = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL ? process.env.VUE_APP_BASE_URL : "https://api.bot.mtheb.tv",
});

export default {
    install(Vue) {
        Vue.prototype.axios = instance;
    }
}