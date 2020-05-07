import Vue from 'vue';

let auth = new Vue({
   computed: {
       accessToken: {
           get: function() {return localStorage.getItem('uat')},
           set: function(token) {localStorage.setItem('uat', token)},
       },
   },
   methods: {
        isAuthenticated: function() {
           return localStorage.getItem('uat') !== null;
        },
        login: function() {
            let loginURL = new URL('https://id.twitch.tv/oauth2/authorize');
            const params = {
                client_id: 'cd1q55j22rdxm0o3lp2jwy8osgsjn2',
                redirect_uri: process.env.NODE_ENV == 'development' ? 'http://localhost:8080/auth' : 'https://bot.mtheb.tv/auth',
                response_type: 'token',
                force_verify: true,
            }
            Object.keys(params).forEach(key => {
                loginURL.searchParams.append(key, params[key]);
            });
            window.location.assign(loginURL);
        },
        logout: function() {
            let url = new URL('https://id.twitch.tv/oauth2/revoke');
            url.searchParams.append('client_id', 'cd1q55j22rdxm0o3lp2jwy8osgsjn2');
            url.searchParams.append('token', this.$auth.accessToken);
            this.axios.post(url);
            localStorage.removeItem('uat');
            localStorage.removeItem('profile');
        },
        getProfileData: function() {
            return this.axios.get('https://api.twitch.tv/helix/users', {
                headers: {
                    'Authorization': `Bearer ${this.$auth.accessToken}`,
                    'Client-ID': 'cd1q55j22rdxm0o3lp2jwy8osgsjn2',
                }
            });
        }
   }
});

export default {
    install(Vue) {
        Vue.prototype.$auth = auth;
    }
}