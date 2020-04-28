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

const router = new VueRouter({
    mode: 'history',
    routes: routes,
});

router.beforeEach((to, from, next) => {
    const auth = router.app.$auth;
    if (to.path !== '/auth') {
        if (to.path === '/' && auth.isAuthenticated()) {
            next('/dashboard');
        } else if (to.path !== '/' && !auth.isAuthenticated()) {
            next('/');
        } else {
            next();
        }
    } else {
        if (to.hash === '') {
            next('/');
        } else {
            next();
        }
    }
});

export default router;