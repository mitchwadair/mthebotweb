import Vue from 'vue';

let auth = new Vue({
   computed: {
       accessToken: {
           get: function() {return localStorage.getItem('uat')},
           set: function(token) {localStorage.setItem('uat', token)},
       },
       profileData: {
           get: function() {return JSON.parse(localStorage.getItem('profile'))},
           set: function(data) {localStorage.setItem('profile', data)},
       }
   },
   methods: {
       isAuthenticated: function() {
           return localStorage.getItem('uat') !== null;
       },
       logout: function() {
            let url = new URL('https://id.twitch.tv/oauth2/revoke')
            url.searchParams.append('client_id', 'cd1q55j22rdxm0o3lp2jwy8osgsjn2');
            url.searchParams.append('token', localStorage.getItem('uat'));
            this.axios.post(url);
            localStorage.removeItem('uat');
            localStorage.removeItem('profile');
       }
   }
});

export default {
    install(Vue) {
        Vue.prototype.$auth = auth;
    }
}