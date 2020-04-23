import Vue from 'vue';
import VueRouter from 'vue-router';
import Dashboard from '../components/Dashboard';

Vue.use(VueRouter);

const routes = [
    {path: '/', redirect: '/dashboard'},
    {path: '/dashboard', component: Dashboard},
    {path: '/about', redirect: '/dashboard'},
]

export default new VueRouter({
    mode: 'history',
    routes: routes,
});