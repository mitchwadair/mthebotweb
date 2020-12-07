import Vue from 'vue';

function createAuth(router) {
    return new Vue({
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
                    redirect_uri: process.env.NODE_ENV == 'development' ? 'http://localhost:8081/auth' : 'https://bot.mtheb.tv/auth',
                    response_type: 'code',
                    force_verify: true,
                    scope: 'channel:read:subscriptions channel:read:redemptions channel:manage:redemptions'
                }
                Object.keys(params).forEach(key => {
                    loginURL.searchParams.append(key, params[key]);
                });
                window.location.assign(decodeURIComponent(loginURL.href));
            },
            logout: function() {
                localStorage.removeItem('uat');
                localStorage.removeItem('userData');
                router.push('/');
            },
            getProfileData: function() {
                return JSON.parse(localStorage.getItem('userData'));
            }
        }
    });
}

export default {
    install(Vue, router) {
        Vue.prototype.$auth = createAuth(router);
    }
}