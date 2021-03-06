import Vue from 'vue';
import VueRouter from 'vue-router';
import Dashboard from '../pages/Dashboard';
import Landing from '../pages/Landing';
import Auth from '../pages/Auth';
import Events from '../pages/Events';
import Commands from '../pages/Commands';
import Timers from '../pages/Timers';
import About from '../pages/About';

Vue.use(VueRouter);

const routes = [
    {path: '/', name: 'landing', component: Landing},
    {path: '/dashboard', name: 'dashboard', component: Dashboard},
    {path: '/about', name: 'about', component: About},
    {path: '/auth', name: 'auth', component: Auth},
    {path: '/events', name: 'events', component: Events},
    {path: '/commands', name: 'commands', component: Commands},
    {path: '/timers', name: 'timers', component: Timers},
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
        } else if (to.path !== '/' && to.path !== '/about' && !auth.isAuthenticated()) {
            next('/');
        } else {
            next();
        }
    } else {
        if (!to.query.code) {
            next('/');
        } else {
            next();
        }
    }
});

export default router;