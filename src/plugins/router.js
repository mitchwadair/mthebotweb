import Vue from 'vue';
import VueRouter from 'vue-router';
import Dashboard from '../pages/Dashboard';
import Landing from '../pages/Landing';
import Auth from '../pages/Auth';

Vue.use(VueRouter);

const routes = [
    {path: '/', name: 'landing', component: Landing},
    {path: '/dashboard', name: 'dashboard', component: Dashboard},
    {path: '/about', redirect: '/dashboard'},
    {path: '/auth', name: 'auth', component: Auth},
]

export default new VueRouter({
    mode: 'history',
    routes: routes,
    base: '/mthebot/',
});