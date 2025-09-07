import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../pages/Dashboard.vue';
import Landing from '../pages/Landing.vue';
import Auth from '../pages/Auth.vue';
import Events from '../pages/Events.vue';
import Commands from '../pages/Commands.vue';
import Timers from '../pages/Timers.vue';
import About from '../pages/About.vue';

const routes = [
  { path: '/', name: 'landing', component: Landing },
  { path: '/dashboard', name: 'dashboard', component: Dashboard },
  { path: '/about', name: 'about', component: About },
  { path: '/auth', name: 'auth', component: Auth },
  { path: '/events', name: 'events', component: Events },
  { path: '/commands', name: 'commands', component: Commands },
  { path: '/timers', name: 'timers', component: Timers },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const isAuthenticated = () => localStorage.getItem('uat') !== null;

router.beforeEach((to, from, next) => {
  if (to.path !== '/auth') {
    if (to.path === '/' && isAuthenticated()) {
      next('/dashboard');
    } else if (to.path !== '/' && to.path !== '/about' && !isAuthenticated()) {
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
